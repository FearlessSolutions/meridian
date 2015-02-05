define([
    './../map-api-publisher',
    './base',
    './clustering',
    './heatmap',
    './../libs/v3.0.0/build/ol-debug'//,
//    './../libs/Heatmap/Heatmap'
], function(publisher, mapBase, mapClustering, mapHeatmap) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context,
        basemapLayers,
        styleCache = {},
        mode; //TODO move this out of here

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            basemapLayers = {};
            styleCache = {};
            mode = 'CLUSTER';
        },
        /**
         * Create layers that are not accessible to the user, and that don't go away
         * @param params
         */
        createStaticLayers: function(params) {
            var geolocatorParams,
                geolocatorLayer,
                drawParams,
                drawLayer,
                heatmapParams,
                heatmapLayer;

            //Create geolocator layer options
            geolocatorParams = {
                map: params.map,
                layerId: 'static_geolocator',
                static: true,
                styleMap: {
                    externalGraphic: '${icon}',
                    graphicHeight: '${height}',
                    graphicWidth:  '${width}',
                    graphicYOffset: context.sandbox.mapConfiguration.markerIcons.default.graphicYOffset || 0
                }
            };
            geolocatorLayer = exposed.createVectorLayer(geolocatorParams);
//            addGeoLocatorListeners({ //TODO
//                map: params.map,
//                layer: geolocatorLayer
//            });

            //Create draw layer options //TODO
            drawParams = {
                map: params.map,
                layerId: 'static_draw',
                static: true,
                styleMap: {
                    default: {
                        fillOpacity: 0.05,
                        strokeOpacity: 1
                    }
                }
            };
            drawLayer = exposed.createVectorLayer(drawParams);

            //Create heatmap layer options //TODO
//            heatmapParams = {
//                map: params.map,
//                layerId: 'static_heatmap',
//                renderers: ['Heatmap'],
//                static: true,
//                styleMap: {
//                    default: new ol.Style({
//                        pointRadius: 10,
//                        // The 'weight' of the point (between 0.0 and 1.0), used by the heatmap renderer.
//                        // The weight is calcluated by the context.weight function below.
//                        weight: '${weight}'
//                    }, {
//                        context: {
//                            weight: function() {
//                                var visibleDataRecordCount = 0;
//                                // Build the visibleDataRecordCount by adding all records from datasets that are visible
//                                context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, value) {
//                                    if(context.sandbox.stateManager.layers[key] && context.sandbox.stateManager.layers[key].visible) {
//                                        visibleDataRecordCount += value.length;
//                                    }
//                                });
//                                // Set initial weight value to 0.1,
//                                // once there are more than 10k records it will decrease by 0.01 per 1k records,
//                                // stopping at a lowest weight of 0.01 at 100k records (it will not go lower, even if more than 100k records)
//                                return Math.max(Math.min(1000 / visibleDataRecordCount, 0.1), 0.01);
//                            }
//                        }
//                    })
//                }
//            };
//            heatmapLayer = exposed.createVectorLayer(heatmapParams);

//            params.map.addLayers([geolocatorLayer, drawLayer, heatmapLayer]); //TODO
//            mapBase.addLayerToSelector({ //TODO
//                map: params.map,
//                layer: geolocatorLayer
//            });

        },
        /**
         * Create new vector layer
         * @param params {
         *      styleMap - Style map for just this layer
         *      layerId - Id for this layer (must be unique).
         *      selectable - If this layer's features should be interactive
         *      canCluster - If this layer's features should cluster
         * }
         * @returns {ol.layer.Vector}
         */
        createVectorLayer: function(params) {
            var layerId = params.layerId,
                canCluster = params.canCluster,
                pointStyle = createStyling(params.styleMap),
                geoSource,
                clusterSource,
                newVectorLayer,
                selector,
                layers;

//            options = {
//                layerId: params.layerId, // set as layerId, is not present its null
//                styleMap: null  // set as null for default of not providing a stylemap
//            };
//
//            context.sandbox.utils.extend(options, params);
////            if(params.styleMap) { //TODO
////                options.styleMap = new ol.StyleMap(params.styleMap);
////            }

//            delete(options.map); // ensure that the map object is not on the options; delete it if it came across in the extend. (If present the layer creation has issues)

            geoSource = new ol.source.GeoJSON({
                    features: [],
                    projection: params.map.getProjection()
                });
//            if(canCluster){
                clusterSource = new ol.source.Cluster({
                    distance: 40,
                    source: geoSource
                });
//            }

            styleCache[layerId] = { //TODO make this more dynamic (with all variables filled out, per variable set ....)
//                cluster: canCluster ? clusterStyling : pointStyle,
                cluster: clusterStyling,
                point: pointStyle
            };

            var newVectorLayer = new ol.layer.Vector({
                layerId: layerId,
                canCluster: canCluster,
//                source: canCluster ? clusterSource : geoSource,
                source:  clusterSource,
                style: function(feature, resolution) {
                    var layerId = feature.get('layerId'),
                        cluster = feature.get('features');
                    if(mode === 'CLUSTER' && cluster){
                        layerId = cluster[0].get('layerId');
                        if(cluster.length = 1){
                            return styleCache[layerId].point(feature, resolution);
                        } else {
                            return styleCache[layerId].cluster(feature, resolution);
                        }
                    }
                    else {
                        return styleCache[layerId].point(feature, resolution);
                    }
                }
            });

//            newVectorLayer = new ol.layer.Vector({
//                layerId: params.layerId,
//                source: new ol.source.Cluster({
//                    distance: 20,
//                    source: new ol.source.GeoJSON({
//                        features: [],
//                        projection: params.map.getProjection()
//                    }),
////                    style: style,
//                    style: function(feature, resolution) {
//                        var size = feature.get('features').length;
//                        var style = styleCache[size];
//                        if (!style) {
//                            style = [new ol.style.Style({
//                                image: new ol.style.Circle({
//                                    radius: 10,
//                                    stroke: new ol.style.Stroke({
//                                        color: '#fff'
//                                    }),
//                                    fill: new ol.style.Fill({
//                                        color: '#3399CC'
//                                    })
//                                }),
//                                text: new ol.style.Text({
//                                    text: size.toString(),
//                                    fill: new ol.style.Fill({
//                                        color: '#fff'
//                                    })
//                                })
//                            })];
//                            styleCache[size] = style;
//                        }
//                        return style;
//                    }
//                })
//            });
//
//            if(context.sandbox.dataStorage.datasets[params.layerId] && context.sandbox.stateManager.map.visualMode === 'heatmap') {
//                newVectorLayer.setVisibility(false);
//            }
//
            params.map.addLayer(newVectorLayer);
//
//            if(params.selectable) {
//                selector = params.map.getControlsByClass('ol.Control.SelectFeature')[0];
//                layers = selector.layers;
//                layers.push(newVectorLayer);
//                selector.setLayer(layers);
//            }
//
            // Default state manager settings for a new layer
            context.sandbox.stateManager.layers[params.layerId] = {
                visible: true,
                hiddenFeatures: [],
                identifiedFeatures: []
            };

            console.debug("created layer ", params.layerId);
            return newVectorLayer;
        },
        /**
         * Add base layer of OSM format
         * @param params
         * @returns {ol.layer.Tile}
         */
        createOSMLayer: function(params) {
            var baseLayer = new ol.layer.Tile({
                name: params.label,
                source: new ol.source.OSM({
                    url: params.url
                })
//                source: new ol.source.OSM()
            });

            return baseLayer;
        },
        /**
         * Create baselayer of WMTS format
         * @param params
         * @returns {ol.layer.Tile}
         */
        createWMTSLayer: function(params) {
            var baseLayer = new ol.layer.Tile({
                opacity: 1,
//              extent: projectionExtent,
                source: new ol.source.WMTS({
                    url: params.url,
                    matrixSet: params.matrixSet,
                    format: params.format,
                    projection: ol.proj.get(params.projection),
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: params.origin,
                        resolutions: params.resolutions,
                        matrixIds: params.matrixIds//,
//                        tileSize: new ol.Size(
//                                params.tileWidth || 256,
//                                params.tileHeight || 256
//                        )
                    }),
                    style: params.style
                })
            });
            return baseLayer;
        },
        setLayerIndex: function(params) {
            params.map.setLayerIndex(params.map.getLayersBy('layerId', params.layerId)[0], params.layerIndex);
        },
        /**
         * Delete layer with given layerId and all of the features in it
         * @param params
         */
        deleteLayer: function(params) {
            var map = params.map,
                selector = params.map.getControlsByClass('ol.Control.SelectFeature')[0],
                layers = selector.layers,
                layer = map.getLayersBy('layerId', params.layerId),
                layerId = params.layerId,
                allIdentifiedFeatures = context.sandbox.stateManager.getAllIdentifiedFeatures() || {};

            //If the layer to be deleted has selected features, deselect them and remove them from the set of selected
            if(allIdentifiedFeatures[layerId] && allIdentifiedFeatures[layerId].length) {
                delete allIdentifiedFeatures[layerId]; //Clear the layer to be deleted from the set

                mapBase.clearMapSelection({
                    map: map
                });
                mapBase.clearMapPopups({
                    map: map
                });
            }

            delete context.sandbox.stateManager.layers[layerId];


            context.sandbox.utils.each(layers, function(layerIndex, layer) {
                if(layer.layerId === layerId) {
                    layers.splice(layerIndex, 1);
                    return false;
                }
            });
            selector.setLayer(layers); //Has the side effect of deselecting everything

            if(layer && layer.length){
                map.removeLayer(layer[0]);
            }

            mapClustering.deleteClusteringLayerOptions({
                layerId: layerId
            });

            mapClustering.update({
                map: map
            });
            mapHeatmap.update({
                map: map
            });

            //Reselect any feature that should be selected
            context.sandbox.utils.each(layers, function(layerIndex, layer) {
                var layerIdentifiedFeatures = allIdentifiedFeatures[layer.layerId];

                if(layerIdentifiedFeatures && layerIdentifiedFeatures.length){
                    context.sandbox.utils.each(layerIdentifiedFeatures, function(identifiedFeatureIndex, identifiedFeatureId){
                        var featureToBeIdentified = layer.getFeatureByFid(identifiedFeatureId);

                        if(featureToBeIdentified){
                            selector.select(featureToBeIdentified);
                        }
                    });
                }

            });




//            context.sandbox.utils.each(allIdentifiedFeatures, function(identifiedFeatureLayerId, identifiedFeatureLayerArray){
//                context.sandbox.utils.each(identifiedFeatureLayerArray, function(identifiedFeatureIndex, identifiedFeatureId){
//                    exposed.identifyFeature({
//                        featureId: identifiedFeatureId,
//                        layerId: identifiedFeatureLayerId,
//                        map: map
//                    });
//                });
//            });

        },
        /**
         * Remove all of the features from a layer, but leave the layer
         * @param params
         */
        clearLayer: function(params) {
//            params.map.getLayersBy('layerId', params.layerId)[0].removeAllFeatures();
        },
        hideLayer: function(params) {
            var currentLayer,
                identifiedFeatures; 

            identifiedFeatures = context.sandbox.stateManager.getIdentifiedFeaturesByLayerId({
                layerId: params.layerId
            });

            if(identifiedFeatures.length) {
                mapBase.clearMapSelection({
                    map: params.map
                });
                mapBase.clearMapPopups({
                    map: params.map
                });
            }

            if(context.sandbox.stateManager.layers[params.layerId] && context.sandbox.dataStorage.datasets[params.layerId]) {
                context.sandbox.stateManager.layers[params.layerId].visible = false;
                mapClustering.update({
                    map: params.map
                });
                mapHeatmap.update({
                    map: params.map
                });
            } else {
                currentLayer = params.map.getLayersBy('layerId', params.layerId)[0];
                if(currentLayer) {
                    currentLayer.setVisibility(false);
                }
            }
        },
        showLayer: function(params) {
            var currentLayer;

            if(context.sandbox.stateManager.layers[params.layerId] && context.sandbox.dataStorage.datasets[params.layerId]) {
                context.sandbox.stateManager.layers[params.layerId].visible = true;
                mapClustering.update({
                    map: params.map
                });
                mapHeatmap.update({
                    map: params.map
                });
            } else {
                currentLayer = params.map.getLayersBy('layerId', params.layerId)[0];
                if(currentLayer) {
                    currentLayer.setVisibility(true);
                }
            }
        },
        /**
         * Change which visual mode the map is in by activating the proper sub-module
         * @param params
         */
        visualModeChanged: function(params) {
            var selector = params.map.getControlsByClass('ol.Control.SelectFeature')[0];
            selector.unselectAll();
            mapClustering.update({
                map: params.map
            });
            mapClustering.visualModeChanged({
                mode: params.mode
            });
            mapHeatmap.update({
                map: params.map
            });
        },
        /**
         * Clear all features and feature layers
         * @param params
         */
        clear: function(params) {
            var layers = params.map.getLayersByClass('ol.Layer.Vector');
            layers.forEach(function(layer) {
                layer.destroy();              
            });
            context.sandbox.stateManager.layers = {};
            mapClustering.clear();
            mapHeatmap.clear({
                map: params.map
            });
        },
        addEventListenersToLayer: function(params) {
            if(params.eventListeners) {
                params.layer.events.on(params.eventListeners);
            } else {
                addDefaultListeners({
                    map: params.map,
                    layer: params.layer
                });
            }
        },
        /**
         * Load basemaps, as defined in the map configuration. Accepts OSM and WMTS
         * @param params
         * @returns {{}}
         */
        loadBasemaps: function(params) {
            context.sandbox.utils.each(context.sandbox.mapConfiguration.basemaps, function(basemap) {
                var baselayerParams = context.sandbox.mapConfiguration.basemaps[basemap],
                    baseLayer;

                switch (baselayerParams.type) {
                    case 'osm':
                        baseLayer = exposed.createOSMLayer({
                            map: params.map,
                            label: baselayerParams.label,
                            url: baselayerParams.url
                        });
                        break;
                    case 'wmts':
                        baseLayer = exposed.createWMTSLayer({
                            map: params.map,
                            name: baselayerParams.name,
                            url: baselayerParams.url,
                            matrixSet: baselayerParams.matrixSet || context.sandbox.mapConfiguration.projection,
                            matrixIds: baselayerParams.matrixIds || null,
                            layer: baselayerParams.layer || null,
                            origin: baselayerParams.origin || [0,0],
                            requestEncoding: baselayerParams.requestEncoding || 'KVP',
                            projection: baselayerParams.projection || context.sandbox.mapConfiguration.projection,
                            format: baselayerParams.format || 'image/jpeg',
                            style: baselayerParams.style || 'default',
                            resolutions: baselayerParams.resolutions || null,
                            wrapDateLine: ('wrapDateLine' in baselayerParams) ? baselayerParams.wrapDateLine : true,
                            tileWidth: baselayerParams.tileWidth || context.sandbox.mapConfiguration.defaultTileWidth,
                            tileHeight: baselayerParams.tileHeight || context.sandbox.mapConfiguration.defaultTileHeight
                        });
                        break;
                    default:
                        context.sandbox.logger.error('Did not load basemap. No support for basemap type:', baselayerParams.type);
                        break;
                }
                if(baseLayer) {
                    params.map.addLayer(baseLayer);
                    basemapLayers[baselayerParams.basemap] = baseLayer;
                }
            });

            return basemapLayers;
        },
        setBasemap: function(params) {
            context.sandbox.utils.each(basemapLayers, function(layerName, baseLayer){
                if(layerName === params.basemap){
                    baseLayer.setVisible(true);
                } else{
                    baseLayer.setVisible(false);
                }
            });
        },
        /**
         * Add popup to feature, even if it is in a cluster
         * @param params
         */
        identifyFeature: function(params) {
            var layerVisibility,
                featureVisibilty,
                layer,
                feature,
                clusterFeatureIndex,
                clusterFeatureCount,
                record,
                currentDataService,
                popup,
                selectController;

            layerVisibility = context.sandbox.stateManager.getLayerStateById({layerId: params.layerId}).visible;
            featureVisibilty = (context.sandbox.stateManager.layers[params.layerId].hiddenFeatures.indexOf(params.featureId) > -1) ? false : true;
            if(layerVisibility && featureVisibilty) {
                layer = params.map.getLayersBy('layerId', params.layerId)[0];
                feature = layer.getFeatureBy('featureId', params.featureId);
                //If no feature is found, it is most likely because it was hidden in a cluster
                if(!feature) {
                    context.sandbox.utils.each(layer.features, function(layerFeatureIndex, layerFeature) {
                        if(layerFeature.cluster) {
                            context.sandbox.utils.each(layerFeature.cluster, function(clusterIndex, clusterFeature) {
                                if(params.featureId === clusterFeature.featureId) {
                                    feature = layerFeature;
                                    record = clusterFeature;
                                    clusterFeatureIndex = clusterIndex + 1;
                                    clusterFeatureCount = feature.cluster.length;
                                }
                            });
                        }
                    });

                    if(!feature) {
                        context.sandbox.logger.error('Feature does not exist on map.');
                        return;
                    }

                    currentDataService = record.attributes.dataService;

                    context.sandbox.dataStorage.getFeatureById(
                        {featureId: record.featureId},
                        function(fullFeature) {
                            var infoWinTemplateRef = context.sandbox.dataServices[currentDataService].infoWinTemplate,
                                headerHTML = '<span>' + clusterFeatureIndex + ' of ' + clusterFeatureCount + '</span>',
                                formattedAttributes = {},
                                bounds,
                                popup,
                                anchor= {size: new ol.Size(0, 0), offset: new ol.Pixel(0, 0)};

                            context.sandbox.utils.each(fullFeature.properties, 
                                function(key, value) {
                                    if((context.sandbox.utils.type(value) === 'string' ||
                                        context.sandbox.utils.type(value) === 'number' ||
                                        context.sandbox.utils.type(value) === 'boolean')) {
                                        formattedAttributes[key] = value;
                                    }
                            });
                            popup = new ol.Popup.FramedCloud('popup',
                                ol.LonLat.fromString(feature.geometry.getCentroid().toShortString()),
                                null,
                                headerHTML + infoWinTemplateRef.buildInfoWinTemplate(
                                    formattedAttributes,
                                    fullFeature
                                ),
                                anchor,
                                true,
                                function() {
                                    mapBase.clearMapSelection({
                                        map: params.map
                                    });
                                    mapBase.clearMapPopups({
                                        map: params.map
                                    });
                                }
                            );
                            popup.layerId = params.layerId;

                            mapBase.clearMapSelection({
                                map: params.map
                            });
                            mapBase.clearMapPopups({
                                map: params.map
                            });

                            bounds = feature.geometry.getBounds();
                            params.map.setCenter(bounds.getCenterLonLat());

                            feature.popup = popup;
                            params.map.addPopup(popup);

                            context.sandbox.dataServices[currentDataService].infoWinTemplate.postRenderingAction(
                                fullFeature,
                                layer.layerId
                            );

                            context.sandbox.stateManager.setIdentifiedFeaturesByLayerId({
                                layerId: layer.layerId,
                                featureIds: [
                                    record.featureId
                                ]
                            });
                            //You still need to "select" the cluster, since that is how deselect is fired.
                            selectController = params.map.getControlsByClass('ol.Control.SelectFeature')[0];
                            selectController.select(feature);
                        }
                    );
                } else {
                    // If not in a cluster, fire the selector event
                    selectController = params.map.getControlsByClass('ol.Control.SelectFeature')[0];
                    selectController.select(feature);
                }
            }
        }

    };

    /**
     * Add mouse position listener
     * @param params
     */
    function addGeoLocatorListeners(params) {
        params.layer.events.on({
            beforefeatureselected: function(evt) {
                mapBase.clearMapSelection({
                    map: params.map
                });
                mapBase.clearMapPopups({
                    map: params.map
                });
            },
            featureselected: function(evt) {
                var projectedPoint,
                    latLonString;

                projectedPoint = evt.feature.geometry.clone().transform(params.map.projection, params.map.projectionWGS84);

                var htmlTemplate =
                    '<div class="locator info-win-dialog">'+
                        '<p class="title">Geocoded Location</p>'+
                        '<div class="content">'+
                            '<div>Lat: '+projectedPoint.y+'</div>'+
                            '<div>Lon: '+projectedPoint.x+'</div>'+
                        '</div>'+
                    '</div>';

                mapBase.identifyFeature({
                    map: params.map,
                    feature: evt.feature,
                    content: htmlTemplate
                });
            },
            featureunselected: function(evt) {
                mapBase.clearMapPopups({
                    map: params.map
                });
            }    
        });
    }

    // TODO: add default listeners for default looking default popups for when in default clustering default mode on default layer in the default map
    function addDefaultListeners(params) {
        params.layer.events.on({
            beforefeatureselected: function(evt) {
                var selectController = params.map.getControlsByClass('ol.Control.SelectFeature')[0];
                selectController.unselectAll();
            },
            featureselected: function(evt) {
                var popup,
                    infoWinTemplateRef,
                    feature = evt.feature,
                    formattedAttributes = {},
                    anchor,
                    bounds,
                    zoom,
                    maxAuto;

                if(!feature.cluster) {

                    context.sandbox.dataStorage.getFeatureById({
                        featureId: feature.featureId},
                        function(fullFeature) {
                            infoWinTemplateRef = context.sandbox.dataServices[feature.attributes.dataService].infoWinTemplate;
                            context.sandbox.utils.each(fullFeature.properties,
                                function(k, v) {
                                    if((context.sandbox.utils.type(v) === 'string' ||
                                        context.sandbox.utils.type(v) === 'number' ||
                                        context.sandbox.utils.type(v) === 'boolean')) {
                                        formattedAttributes[k] = v;
                                    }
                            });

                            anchor= {size: new ol.Size(0, 0), offset: new ol.Pixel(0, -(feature.attributes.height/2))};
                            popup = new ol.Popup.FramedCloud('popup',
                                ol.LonLat.fromString(feature.geometry.getCentroid().toShortString()),
                                null,
                                infoWinTemplateRef.buildInfoWinTemplate(
                                    formattedAttributes,
                                    fullFeature
                                ),
                                anchor,
                                true,
                                function() {
                                    mapBase.clearMapSelection({
                                        map: params.map
                                    });
                                    mapBase.clearMapPopups({
                                        map: params.map
                                    });
                                }
                            );
                            feature.popup = popup;
                            params.map.addPopup(popup);
                            infoWinTemplateRef.postRenderingAction(fullFeature, feature.layer.layerId);

                            context.sandbox.stateManager.setIdentifiedFeaturesByLayerId({
                                layerId: feature.layer.layerId,
                                featureIds: [
                                    feature.featureId
                                ]
                            });
                        }
                    );
                } else {
                    bounds = feature.geometry.getBounds();
                    feature.cluster.forEach(function(point) {
                        bounds.extend(point.geometry.getBounds());
                    });
                    zoom = params.map.getZoomForExtent(bounds);

                    //If there is a popup already attached, just zoom to the cluster (done below)
                    if(!feature.popup){
                        // To prevent zooming in too far
                        // Sources don't always provide the correct information
                        // as to what levels they have imagery for.
                        //
                        // Clicking a cluster should never zoom the user out.
                        maxAuto = context.sandbox.mapConfiguration.maxAutoZoomLevel;
                        if(zoom > maxAuto) {
                            zoom = params.map.zoom > maxAuto ? params.map.zoom : maxAuto;
                            publisher.publishMessage({
                                messageType: 'warning',
                                messageTitle: 'Auto Zoom',
                                messageText: 'Auto zoom is at maximum zoom level. Please use manual zoom for more detail.'
                            });
                        }
                        params.map.setCenter(bounds.getCenterLonLat(), zoom);
                    }
                }
            },
            featureunselected: function(evt) {
                var feature = evt.feature;

                if(feature.popup){
                    params.map.removePopup(feature.popup);
                    feature.popup.destroy();
                    feature.popup = null;
                }
            }
        });
    }


    /**
     * Creates function to style the point layer
     * TODO REQUIRED the styles all need to be saved instead of manually calculated each time
     * @param layerStyling
     * @returns {*} function(feature, resolution) for styling
     */
    function createStyling(layerStyling){
        var options = {},
            color,
            style;

        if(layerStyling){
            //TODO dynamic choosers (This assumes that all properties are static
            if(layerStyling.icon){
                options.image = new ol.style.Icon({
                    src: layerStyling.icon.icon,
                    anchor: [0.5, 1], //TODO make dynamic?
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    scale:.5
                });
            }

            /**
             * If there is fill options, use them.
             * OL doesn't have a seperate option for opacity, so turn hex/string into rgb
             */
            if(layerStyling.fill && 'fillColor' in layerStyling.fill) {
                color = ol.color.asArray(layerStyling.fill.fillColor);
                if('fillOpacity' in layerStyling.fill){
                    color = color.slice(); //This is to not interfere will ol.color.asArray
                    color[3] = layerStyling.fill.fillOpacity;
                    color = ol.color.asString(color);
                }
                options.fill =  new ol.style.Fill({
                    color: color
                });
            }

            if(layerStyling.stroke
                && 'strokeColor' in layerStyling.stroke
                && 'strokeOpacity' in layerStyling.stroke
                && 'strokeWidth' in layerStyling.stroke){
                options.stroke = new ol.style.Stroke({
                    color: layerStyling.stroke.strokeColor,
                    opacity: layerStyling.stroke.strokeOpacity,
                    width: 2
                });
            }
            style = new ol.style.Style(options);

            return function(){
                return [style]
            };
        } else {
            return defaultStyling;
        }

    }
    function defaultStyling(feature, resolution){
        var icon = feature.get('icon') || context.sandbox.mapConfiguration.markerIcons.default.icon//,
//            height = feature.get('height') || context.sandbox.mapConfiguration.markerIcons.default.height,
//            width = feature.get('width') || context.sandbox.mapConfiguration.markerIcons.default.width,
//            yOffset = feature.get('yOffset');

         if(icon){
             return [new ol.style.Style({ //TODO this is just a default style for box
                 image: new ol.style.Icon({
                     src: icon,
                     anchor: [0.5, 1],
                     anchorXUnits: 'fraction',
                     anchorYUnits: 'fraction',
                     scale: .5
                 })
             })];
         }
    }

    function clusterStyling(feature, resolution){
        var size = feature.get('features') ? feature.get('features').length : 0;
        var style = styleCache[size];
        if (!style) {
            style = [new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10 + size/2,
                    stroke: new ol.style.Stroke({
                        color: 'rgb(123, 0, 123)',
//                                    color: 'rgb(153, 0, 153, .5)',
                        opacity:.5,
                        width: size/3.0
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgb(153, 0, 153)',
//                                    color: 'rgb(153, 0, 153, .9)'
                        opacity:.5
                    })
                }),
                text: new ol.style.Text({
                    text: size.toString(),
                    fill: new ol.style.Fill({
                        color: '#fff'
                    })
                })
            })];
            styleCache[size] = style;
        }
        return style;
    }

    return exposed;
});