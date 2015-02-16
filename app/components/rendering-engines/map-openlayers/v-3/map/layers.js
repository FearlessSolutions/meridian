define([
    './../libs/v3.0.0/build/ol-debug'
], function() {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context,
        publisher,
        mapBase,
        mapClustering,
        mapHeatmap,
        mapSelection,
        basemapLayers,
        map,
        styleCache = {},
        CLUSTER_MODE,
        FEATURE_MODE,
        HEAT_MODE,
        AOI_TYPE,
        STATIC_TYPE;


    var exposed = {
        init: function(modules) {
            context = modules.context;
            publisher = modules.publisher;
            mapBase = modules.base;
            mapClustering = modules.clustering;
            mapHeatmap = modules.heatmap;
            mapSelection = modules.selection;
            basemapLayers = {};
            styleCache = {
                default: {
                    styleCache: {},
                    selectedStyleCache:{}
                }
            };
            CLUSTER_MODE = context.sandbox.mapConfiguration.CLUSTER_MODE;
            FEATURE_MODE = context.sandbox.mapConfiguration.FEATURE_MODE;
            HEAT_MODE = context.sandbox.mapConfiguration.HEAT_MODE;
            AOI_TYPE = context.sandbox.mapConfiguration.AOI_TYPE;
            STATIC_TYPE = context.sandbox.mapConfiguration.STATIC_TYPE;
        },
        setMap: function(params){
            map = params.map;
        },
        /**
         * Create layers that are not accessible to the user, and that don't go away
         * @param params
         */
        createStaticLayers: function(params) {
            var geolocatorParams,
                geolocatorLayer,
                drawParams,
                drawLayer;

            //Create geolocator layer options
            geolocatorParams = {
                layerId: context.sandbox.mapConfiguration.GEOLOCATOR_LAYERID,
                layerType: STATIC_TYPE,
                canCluster: false,
                selectable: true,
                static: true
            };
            geolocatorLayer = exposed.createVectorLayer(geolocatorParams);
//            addGeoLocatorListeners({ //TODO
//                layer: geolocatorLayer
//            });

            //Create draw layer options //TODO
            drawParams = {
                layerId: 'static_draw',
                layerType: STATIC_TYPE,
                static: true,
                styleMap: {
                    default: {
                        fillOpacity: 0.05,
                        strokeOpacity: 1
                    }
                }
            };
            drawLayer = exposed.createVectorLayer(drawParams);
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
                layerType = params.layerType || FEATURE_MODE,
                selectable = 'selectable' in params ? params.selectable : false,
                canCluster = params.canCluster,
                styleMap = params.styleMap,
                geoSource,
                newFeatureLayer,
                visualMode = context.sandbox.stateManager.map.visualMode,
                shouldBeVisible;

            geoSource = new ol.source.GeoJSON({
                features: [],
                projection: map.getProjection()
            });

            styleCache[layerId] = { //TODO make this more dynamic (with all variables filled out, per variable set ....) {
                styleMap: styleMap,
                styleCache: {},
                selectedStyleCache: {}
            };

            shouldBeVisible = visualMode === FEATURE_MODE
                || layerType === STATIC_TYPE
                || (layerType === AOI_TYPE && visualMode !== HEAT_MODE);

            newFeatureLayer = new ol.layer.Vector({
                layerId: layerId,
                layerType: layerType,
                selectable: selectable,
                canCluster: canCluster,
                source: geoSource,
                style: featureStyling,
                visible: shouldBeVisible
            });

            map.addLayer(newFeatureLayer);


            if(selectable){
                mapSelection.addSelectionToLayer({
                    layer: newFeatureLayer
                });
            }
            if(canCluster){
                mapClustering.setupClusteringForLayer(params, geoSource);
            }

            // Default state manager settings for a new layer
            context.sandbox.stateManager.layers[params.layerId] = {
                visible: true,
                hiddenFeatures: [],
                identifiedFeatures: []
            };

            return newFeatureLayer;
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
            map.setLayerIndex(map.getLayersBy('layerId', params.layerId)[0], params.layerIndex);
        },
        /**
         * Delete layer with given layerId and all of the features in it
         * @param params
         */
        deleteLayer: function(params) { //TODO
            var layers = selector.layers,
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
//            map.getLayersBy('layerId', params.layerId)[0].removeAllFeatures();
        },
        hideLayer: function(params) {
            var layerId = params.layerId,
                currentLayer = map.getLayer(layerId),
                identifiedFeatures;

            if(currentLayer && currentLayer.getVisible()){ //Hide if layer exists and is visible
                currentLayer.setVisible(false);
            }

//            TODO when identified works with popups, do this
//            identifiedFeatures = context.sandbox.stateManager.getIdentifiedFeaturesByLayerId({
//                layerId: params.layerId
//            });
//
//            if(identifiedFeatures.length) {
//                mapBase.clearMapSelection({
//                });
//                mapBase.clearMapPopups({
//                });
//            }

        },
        showLayer: function(params) {
            var currentLayer;

            if(context.sandbox.stateManager.layers[params.layerId] && context.sandbox.dataStorage.datasets[params.layerId]) {
                context.sandbox.stateManager.layers[params.layerId].visible = true;
                mapClustering.update({});
                mapHeatmap.update({ });
            } else {
                currentLayer = map.getLayersBy('layerId', params.layerId)[0];
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
            var visualMode = context.sandbox.stateManager.map.visualMode;

            //Change mode, disabling before enabling
            if(visualMode === FEATURE_MODE){
                mapHeatmap.disable({});
                mapClustering.disable({});
                enableFeatureMode({
                });
            } else if(visualMode === CLUSTER_MODE){
                mapHeatmap.disable({});
                disableFeatureMode({});
                mapClustering.enable({});
            } else if(visualMode === HEAT_MODE){
                mapClustering.disable({});
                disableFeatureMode({});
                mapHeatmap.enable({});
            } else {
                mapHeatmap.disable({});
                mapClustering.disable({});
                disableFeatureMode({});
            }

            map.render();
        },
        /**
         * Clear all features and feature layers
         * @param params
         */
        clear: function(params) {
            var layers = map.getLayers();

            context.sandbox.stateManager.layers = {};

            layers.forEach(function(layer) {
                var layerType = layer.get('layerType'),
                    layerId = layer.get('layerId');

                if(layerType === AOI_TYPE || layerType === FEATURE_MODE){ //totally remove feature layers and AOIs
                    map.removeLayer(layer);
                } else if (layerType === STATIC_TYPE){ //Clear geolocator and draw
                    layer.clear();
                }
            });

            styleCache = {
                default: {
                    styleCache: {},
                    selectedStyleCache:{}
                }
            };
        },
        addEventListenersToLayer: function(params) {
            if(params.eventListeners) {
                params.layer.events.on(params.eventListeners);
            } else {
                addDefaultListeners({
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
                            label: baselayerParams.label,
                            url: baselayerParams.url
                        });
                        break;
                    case 'wmts':
                        baseLayer = exposed.createWMTSLayer({
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
                    map.addLayer(baseLayer);
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
                layer = map.getLayersBy('layerId', params.layerId)[0];
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
                                    mapBase.clearMapSelection({});
                                    mapBase.clearMapPopups({});
                                }
                            );
                            popup.layerId = params.layerId;

                            mapBase.clearMapSelection({});
                            mapBase.clearMapPopups({});

                            bounds = feature.geometry.getBounds();
                            map.setCenter(bounds.getCenterLonLat());

                            feature.popup = popup;
                            map.addPopup(popup);

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
                            selectController = map.getControlsByClass('ol.Control.SelectFeature')[0];
                            selectController.select(feature);
                        }
                    );
                } else {
                    // If not in a cluster, fire the selector event
                    selectController = map.getControlsByClass('ol.Control.SelectFeature')[0];
                    selectController.select(feature);
                }
            }
        },
        getFeatureStyling: function(params){
            var feature = params.feature,
                resolution = params.resolution;
            return featureStyling(feature, resolution);
        },
        getSelectedFeatureStyling: function(params){
            var feature = params.feature,
                resolution = params.resolution,
                icon,
                style,
                styleKey;

            icon = styleKey = feature.get('selectedIcon') || context.sandbox.mapConfiguration.markerIcons.selectedDefault.icon;
            style = styleCache.default.selectedStyleCache[styleKey];
            if(!style){
                style = new ol.style.Style({ //TODO this is just a default style for box
                    image: new ol.style.Icon({
                        src: icon,
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        scale: .2
                    })
                });

                styleCache.default.selectedStyleCache[styleKey] = style;
            }

            return [style];
        }
    };

    /**
     * Add mouse position listener
     * @param params
     */
    function addGeoLocatorListeners(params) {
        params.layer.events.on({
            beforeFeatureselected: function(evt) {
                mapBase.clearMapSelection({});
                mapBase.clearMapPopups({});
            },
            featureselected: function(evt) {
                var projectedPoint,
                    latLonString;

                projectedPoint = evt.feature.geometry.clone().transform(map.projection, map.projectionWGS84);

                var htmlTemplate =
                    '<div class="locator info-win-dialog">'+
                        '<p class="title">Geocoded Location</p>'+
                        '<div class="content">'+
                            '<div>Lat: '+projectedPoint.y+'</div>'+
                            '<div>Lon: '+projectedPoint.x+'</div>'+
                        '</div>'+
                    '</div>';

                mapBase.identifyFeature({
                    feature: evt.feature,
                    content: htmlTemplate
                });
            },
            featureunselected: function(evt) {
                mapBase.clearMapPopups({});
            }    
        });
    }

    // TODO: add default listeners for default looking default popups for when in default clustering default mode on default layer in the default map
    function addDefaultListeners(params) {
        params.layer.events.on({
            beforefeatureselected: function(evt) {
                var selectController = map.getControlsByClass('ol.Control.SelectFeature')[0];
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
                                    mapBase.clearMapSelection({});
                                    mapBase.clearMapPopups({});
                                }
                            );
                            feature.popup = popup;
                            map.addPopup(popup);
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
                    zoom = map.getZoomForExtent(bounds);

                    //If there is a popup already attached, just zoom to the cluster (done below)
                    if(!feature.popup){
                        // To prevent zooming in too far
                        // Sources don't always provide the correct information
                        // as to what levels they have imagery for.
                        //
                        // Clicking a cluster should never zoom the user out.
                        maxAuto = context.sandbox.mapConfiguration.maxAutoZoomLevel;
                        if(zoom > maxAuto) {
                            zoom = map.zoom > maxAuto ? map.zoom : maxAuto;
                            publisher.publishMessage({
                                messageType: 'warning',
                                messageTitle: 'Auto Zoom',
                                messageText: 'Auto zoom is at maximum zoom level. Please use manual zoom for more detail.'
                            });
                        }
                        map.setCenter(bounds.getCenterLonLat(), zoom);
                    }
                }
            },
            featureunselected: function(evt) {
                var feature = evt.feature;

                if(feature.popup){
                    map.removePopup(feature.popup);
                    feature.popup.destroy();
                    feature.popup = null;
                }
            }
        });
    }

    function enableFeatureMode(params){
        map.getLayers().forEach(function(layer, layerIndex, layerArray){
            var layerType = layer.get('layerType');
            if (layerType === FEATURE_MODE
                || layerType === STATIC_TYPE
                || layerType === AOI_TYPE){
                layer.setVisible(true);
            }
        });
    }

    function disableFeatureMode(params){
        map.getLayers().forEach(function(layer, layerIndex, layerArray){
            var layerType = layer.get('layerType');
            if (layerType === FEATURE_MODE){
                layer.setVisible(false);
            }
        });
    }

    function featureStyling(feature, resolution){
        var layerId = feature.get('layerId'),
            styleMap = styleCache[layerId].styleMap,
            styleKey = '',
            options = {},
            icon,
            color,
            style;

        if(styleMap){
            //TODO dynamic choosers (This assumes that all properties are static
            if(styleMap.icon){
                styleKey += 'icon|'
                    + styleMap.icon.icon
            }
            if(styleMap.fill){
                styleKey += 'fill|'
                    + styleMap.fill.fillColor
                    + styleMap.fill.fillOpacity
            }
            if(styleMap.stroke){
                styleKey += 'stroke|'
                    + styleMap.stroke.strokeColor
                    + styleMap.stroke.strokeOpacity
                    + styleMap.stroke.strokeWidth
            }
            style = styleCache[layerId].styleCache[styleKey];
            if(!style){
                if(styleMap.icon){
                    options.image = new ol.style.Icon({
                        src: styleMap.icon.icon,
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
                if(styleMap.fill && 'fillColor' in styleMap.fill) {
                    color = ol.color.asArray(styleMap.fill.fillColor);
                    if('fillOpacity' in styleMap.fill){
                        color = color.slice(); //This is to not interfere will ol.color.asArray
                        color[3] = styleMap.fill.fillOpacity;
                        color = ol.color.asString(color);
                    }
                    options.fill =  new ol.style.Fill({
                        color: color
                    });
                }

                if(styleMap.stroke
                    && 'strokeColor' in styleMap.stroke
                    && 'strokeOpacity' in styleMap.stroke
                    && 'strokeWidth' in styleMap.stroke){
                    options.stroke = new ol.style.Stroke({
                        color: styleMap.stroke.strokeColor,
                        opacity: styleMap.stroke.strokeOpacity,
                        width: 2
                    });
                }
                style = new ol.style.Style(options);
                styleCache[layerId].styleCache[styleKey] = style;
            }

        } else {
            icon = styleKey = feature.get('icon') || context.sandbox.mapConfiguration.markerIcons.default.icon;
            style = styleCache.default.styleCache[styleKey];
            if(!style){
                style = new ol.style.Style({ //TODO this is just a default style for box
                    image: new ol.style.Icon({
                        src: icon,
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        scale: .5
                    })
                });

                styleCache.default.styleCache[styleKey] = style;
            }
        }

        return [style];
    }

    var radius = 75;
    function doSpy(map){
        $(document).keydown(function(evt) {
            if (evt.which === 38) {
                radius = Math.min(radius + 5, 150);
                map.render();
            } else if (evt.which === 40) {
                radius = Math.max(radius - 5, 25);
                map.render();
            }
        });

        // get the pixel position with every move
        var mousePosition = null;
        var viewPort = map.getViewport();
        var $viewPort = $(viewPort);

        $viewPort.on('mousemove', function(evt) {
            mousePosition = map.getEventPixel(evt.originalEvent);
            map.render();
        }).on('mouseout', function() {
            mousePosition = null;
            map.render();
        });

        var keys = Object.keys(basemapLayers);
        var baseLayer1 = basemapLayers[keys[0]];
        var baseLayer2 = basemapLayers[keys[1]];
        baseLayer1.setVisible(true);
        baseLayer2.setVisible(true);

// before rendering the layer, do some clipping
        baseLayer2.on('precompose', function(event) {
            var ctx = event.context;
            var pixelRatio = event.frameState.pixelRatio;
            ctx.save();
            ctx.beginPath();
            if (mousePosition) {
                // only show a circle around the mouse
                ctx.arc(mousePosition[0] * pixelRatio, mousePosition[1] * pixelRatio,
                        radius * pixelRatio, 0, 2 * Math.PI);
                ctx.lineWidth = 5 * pixelRatio;
                ctx.strokeStyle = 'rgba(0,0,0,0.5)';
                ctx.stroke();
            }
            ctx.clip();
        });

// after rendering the layer, restore the canvas context
        baseLayer2.on('postcompose', function(event) {
            var ctx = event.context;
            ctx.restore();
        });
    }

    return exposed;
});