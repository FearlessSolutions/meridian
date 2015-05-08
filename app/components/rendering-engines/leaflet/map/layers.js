define([
    './../map-api-publisher',
    'text!./../cluster.hbs',
    './../libs/markerCluster/leaflet.markercluster-src',
    './../libs/wmts/leaflet-tilelayer-wmts-src.js',
    './../libs/leaflet-featureidgroup-src'
], function(publisher, clusterHBS) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context,
        map,
        config,
        clusterTemplate,
        drawnItemsLayer,
        basemapLayers,
        singlePointLayer,
        clusterLayers,
        heatLayers,
        allLayers,
        featureIcons,
        clusterStyles;

    var exposed = {
        init: function(thisContext, thisMap) {
            context = thisContext;
            map = thisMap;
            drawnItemsLayer = {};
            basemapLayers = {};
            featureIcons = {};
            clusterStyles = {
                defaultStyle: {}
            };
            config = context.sandbox.mapConfiguration;
            clusterTemplate = Handlebars.compile(clusterHBS);
            loadBasemaps();
            exposed.setBasemap({
                basemap: config.defaultBaseMap
            });

            createViewLayers();
            createDrawLayer()
        },
        plotFeatures: function(params){
            var layerId = params.layerId;

            context.sandbox.util.each(params.data, function(index, obj){
                //geoJson objects
                var geo = L.geoJson(obj,{
                    onEachFeature: function (feature, layer){
                        if(feature.geometry.type === 'Point'){
                            layer.setIcon(getPointStyle(feature, layerId));
                        }
                    },
                    style: function(feature){
                        return config.shapeStyles.rectangle.shapeOptions;
                    }
                });

                if(context.sandbox.stateManager.map.visualMode === 'cluster'){
                    if(clusterLayers.hasLayerId(params.layerId) === false){
                    }
                    clusterLayers.addDataToLayer(params.layerId, geo);
                }
                else if(context.sandbox.stateManager.map.visualMode === 'heatmap'){

                } else{//for single points

                }
            });
        },
        clearDrawing: function(params){
            drawnItemsLayer.clearLayers();
        },

        createVectorLayer: function(params) {
            var layerId = params.layerId;

            if(!clusterStyles[layerId]){ //TODO only do this if the layer can cluster
                clusterStyles[layerId] = {};
            }

            if(context.sandbox.stateManager.map.visualMode === 'cluster'){
                clusterLayers.addLayer(params.layerId, new L.MarkerClusterGroup({
                        maxClusterRadius: config.clustering.thresholds.clustering.distance,
                        iconCreateFunction: function(cluster){
                            return getClusterStyle(cluster);
                        }
                    })
                ); 

            } else if( context.sandbox.stateManager.map.visualMode === 'heatmap'){
                
            } else {

            }

            //var options,
            //    newVectorLayer,
            //    selector,
            //    layers;
            //
                // console.debug('singlePointLayer: ', singlePointLayer);
                // console.debug('clusterlayers: ', clusterLayers);
            // options = {
            //     "layerId": params.layerId, // set as layerId, is not present its null
            //     "styleMap": null  // set as null for default of not providing a stylemap
            // };
            // context.sandbox.utils.extend(options, params);
            // if(params.styleMap) {
            //     options.styleMap = new OpenLayers.StyleMap(params.styleMap);
            // }
            // delete(options.map); // ensure that the map object is not on the options; delete it if it came across in the extend. (If present the layer creation has issues)
            // newVectorLayer = new OpenLayers.Layer.Vector(
            //     params.layerId,
            //     options
            // );
            // if(context.sandbox.dataStorage.datasets[params.layerId] && context.sandbox.stateManager.map.visualMode === 'heatmap') {
            //     newVectorLayer.setVisibility(false);
            // }
            // map.addLayers([newVectorLayer]);
            // if(params.selectable) {
            //     selector = map.getControlsByClass('OpenLayers.Control.SelectFeature')[0];
            //     layers = selector.layers;
            //     layers.push(newVectorLayer);
            //     selector.setLayer(layers);
            // }
            // // Default state manager settings for a new layer
            // context.sandbox.stateManager.layers[params.layerId] = {
            //     "visible": true,
            //     "hiddenFeatures": [],
            //     "identifiedFeatures": []
            // };
            // return newVectorLayer;
        },
        setLayerIndex: function(params) {
            map.setLayerIndex(map.getLayersBy('layerId', params.layerId)[0], params.layerIndex);
        },
        deleteLayer: function(params) {
            var map = map,
                selector = map.getControlsByClass('OpenLayers.Control.SelectFeature')[0],
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

               // context.sandbox.utils.each(allIdentifiedFeatures, function(identifiedFeatureLayerId, identifiedFeatureLayerArray){
               //     context.sandbox.utils.each(identifiedFeatureLayerArray, function(identifiedFeatureIndex, identifiedFeatureId){
               //         exposed.identifyFeature({
               //             featureId: identifiedFeatureId,
               //             layerId: identifiedFeatureLayerId,
               //             map: map
               //         });
               //     });
               // });

        },
        clearLayer: function(params) {
            map.getLayersBy('layerId', params.layerId)[0].removeAllFeatures();
        },
        hideLayer: function(params) {
            var currentLayer,
                identifiedFeatures; 

            identifiedFeatures = context.sandbox.stateManager.getIdentifiedFeaturesByLayerId({
                "layerId": params.layerId
            });

            if(identifiedFeatures.length) {
                mapBase.clearMapSelection({
                });
                mapBase.clearMapPopups({
                });
            }

            if(context.sandbox.stateManager.layers[params.layerId] && context.sandbox.dataStorage.datasets[params.layerId]) {
                context.sandbox.stateManager.layers[params.layerId].visible = false;
                mapClustering.update({
                });
                mapHeatmap.update({
                });
            } else {
                currentLayer = map.getLayersBy('layerId', params.layerId)[0];
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
                });
                mapHeatmap.update({
                });
            } else {
                currentLayer = map.getLayersBy('layerId', params.layerId)[0];
                if(currentLayer) {
                    currentLayer.setVisibility(true);
                }
            }
        },
        getActiveLayer: function(params){//DONE

            if(context.sandbox.stateManager.map.visualMode === 'cluster'){
                return clusterLayers;
            }
            else if(context.sandbox.stateManager.map.visualMode === 'heatmap'){
                return heatLayers;
            } else{//for single points
                return singlePointLayer;
            }
        },
        visualModeChanged: function(params) { //TODO duplicate?
            var selector = map.getControlsByClass('OpenLayers.Control.SelectFeature')[0];
            selector.unselectAll();
            mapClustering.update({
            });
            mapClustering.visualModeChanged({
                "mode": params.mode
            });
            mapHeatmap.update({
            });
        },
        clear: function(params) {
            var layers = map.getLayersByClass('OpenLayers.Layer.Vector');
            layers.forEach(function(layer) {
                layer.destroy();              
            });
            context.sandbox.stateManager.layers = {};
            mapClustering.clear();
            mapHeatmap.clear({
            });
        },
        addEventListenersToLayer: function(params) {
            if(params.eventListeners) {
                params.layer.events.on(params.eventListeners);
            } else {
                addDefaultListeners({
                    "layer": params.layer
                });
            }
        },
        setBasemap: function(params) {
            var baseLayer = basemapLayers[params.basemap];
            map.addLayer(baseLayer);
            map.eachLayer(function (layer){
                //make sure its a tileLayer (contains _url)
                //make sure the layer to be removed its not the same that was just added. 
                if(layer._url && (layer._url !== baseLayer._url)){
                    map.removeLayer(layer);
                }
            });
            
            
        },
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

            layerVisibility = context.sandbox.stateManager.getLayerStateById({"layerId": params.layerId}).visible;
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
                        {"featureId": record.featureId},
                        function(fullFeature) {
                            var infoWinTemplateRef = context.sandbox.dataServices[currentDataService].infoWinTemplate,
                                headerHTML = '<span>' + clusterFeatureIndex + ' of ' + clusterFeatureCount + '</span>',
                                formattedAttributes = {},
                                bounds,
                                popup,
                                anchor= {"size": new OpenLayers.Size(0, 0), "offset": new OpenLayers.Pixel(0, 0)};

                            context.sandbox.utils.each(fullFeature.properties, 
                                function(key, value) {
                                    if((context.sandbox.utils.type(value) === "string" ||
                                        context.sandbox.utils.type(value) === "number" ||
                                        context.sandbox.utils.type(value) === "boolean")) {
                                        formattedAttributes[key] = value;
                                    }
                            });
                            popup = new OpenLayers.Popup.FramedCloud('popup',
                                OpenLayers.LonLat.fromString(feature.geometry.getCentroid().toShortString()),
                                null,
                                headerHTML + infoWinTemplateRef.buildInfoWinTemplate(
                                    formattedAttributes,
                                    fullFeature
                                ),
                                anchor,
                                true,
                                function() {
                                    mapBase.clearMapSelection({
                                    });
                                    mapBase.clearMapPopups({
                                    });
                                }
                            );
                            popup.layerId = params.layerId;

                            mapBase.clearMapSelection({
                            });
                            mapBase.clearMapPopups({
                            });

                            bounds = feature.geometry.getBounds();
                            map.setCenter(bounds.getCenterLonLat());

                            feature.popup = popup;
                            map.addPopup(popup);

                            context.sandbox.dataServices[currentDataService].infoWinTemplate.postRenderingAction(
                                fullFeature,
                                layer.layerId
                            );

                            context.sandbox.stateManager.setIdentifiedFeaturesByLayerId({
                                "layerId": layer.layerId,
                                "featureIds": [
                                    record.featureId
                                ]
                            });
                            //You still need to "select" the cluster, since that is how deselect is fired.
                            selectController = map.getControlsByClass('OpenLayers.Control.SelectFeature')[0];
                            selectController.select(feature);
                        }
                    );
                } else {
                    // If not in a cluster, fire the selector event
                    selectController = map.getControlsByClass('OpenLayers.Control.SelectFeature')[0];
                    selectController.select(feature);
                }
            }
        },
        setVisualMode: function(params) { //TODO duplicate?
            if(params && params.mode) {
                context.sandbox.stateManager.map.visualMode = params.mode;
            }
        }

    };

    function loadBasemaps(){
        context.sandbox.utils.each(config.basemaps, function(basemapIndex, basemap) {
            var baseLayer;

            switch (basemap.type) {
                case "osm":
                    baseLayer = L.tileLayer(basemap.leafUrl); //TODO config.basemap === basemap? or maybe a second paramater?
                    break;
                case "wmts":
                    baseLayer = L.TileLayer.WMTS(basemap.url, {
                        layer: basemap.layer || null,
                        style: basemap.style, //Don't see this?
                        tilematrixSet: basemap.matrixSet || config.projection,
                        format: basemap.format || 'image/jpeg',
                        tileSize: basemap.tileWidth || config.defaultTileWidth//the plugin uses only one size for both width and height.
                    });
                    break;
                default:
                    context.sandbox.logger.error('Did not load basemap. No support for basemap type:', basemap.type);
                    break;
            }
            if(baseLayer) {
                basemapLayers[basemap.basemap] = baseLayer;
            }
        });
    }

    function createViewLayers(){
        singlePointLayer = new L.featureIdGroup();
        clusterLayers = new L.featureIdGroup();
        heatLayers = new L.featureIdGroup();

        map.addLayer(clusterLayers);
        map.addLayer(heatLayers);
        map.addLayer(singlePointLayer);

        // var geolocatorParams,
        //     geolocatorLayer,
        //     drawParams,
        //     drawLayer,
        //     heatmapParams,
        //     heatmapLayer;
        // //Create geolocator layer options
        // geolocatorParams = {
        //     "map": map,
        //     "layerId": "static_geolocator",
        //     "static": true,
        //     "styleMap": {
        //         "externalGraphic": "${icon}",
        //         "graphicHeight": "${height}",
        //         "graphicWidth":  "${width}",
        //         "graphicYOffset": config.markerIcons.default.graphicYOffset || 0
        //     }
        // };
        // geolocatorLayer = exposed.createVectorLayer(geolocatorParams);
        // addGeoLocatorListeners({
        //     "map": map,
        //     "layer": geolocatorLayer
        // });
        // //Create draw layer options
        // drawParams = {
        //     "map": map,
        //     "layerId": "static_draw",
        //     "static": true,
        //     "styleMap": {
        //         "default": {
        //             "fillOpacity": 0.05,
        //             "strokeOpacity": 1
        //         }
        //     }
        // };
        // drawLayer = exposed.createVectorLayer(drawParams);
        // addDrawListeners({
        //     "map": map,
        //     "layer": drawLayer
        // });
        // //Create heatmap layer options
        // heatmapParams = {
        //     "map": map,
        //     "layerId": "static_heatmap",
        //     "renderers": ['Heatmap'],
        //     "static": true,
        //     "styleMap": {
        //         "default": new OpenLayers.Style({
        //             "pointRadius": 10,
        //             // The 'weight' of the point (between 0.0 and 1.0), used by the heatmap renderer.
        //             // The weight is calcluated by the context.weight function below.
        //             "weight": "${weight}"
        //         }, {
        //             "context": {
        //                 weight: function() {
        //                     var visibleDataRecordCount = 0;
        //                     // Build the visibleDataRecordCount by adding all records from datasets that are visible
        //                     context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, value) {
        //                         if(context.sandbox.stateManager.layers[key] && context.sandbox.stateManager.layers[key].visible) {
        //                             visibleDataRecordCount += value.length;
        //                         }
        //                     });
        //                     // Set initial weight value to 0.1,
        //                     // once there are more than 10k records it will decrease by 0.01 per 1k records,
        //                     // stopping at a lowest weight of 0.01 at 100k records (it will not go lower, even if more than 100k records)
        //                     return Math.max(Math.min(1000 / visibleDataRecordCount, 0.1), 0.01);
        //                 }
        //             }
        //         })
        //     }
        // };
        // heatmapLayer = exposed.createVectorLayer(heatmapParams);
        // map.addLayers([geolocatorLayer, drawLayer, heatmapLayer]);
        // mapBase.addLayerToSelector({
        //     "map": map,
        //     "layer": geolocatorLayer
        // });
    }

    function createDrawLayer(){
        drawnItemsLayer = new L.FeatureGroup();
        map.addLayer(drawnItemsLayer);
        return drawnItemsLayer;
    }

    return exposed;

    function getPointStyle(feature, layerId){
        var iconDefaults = config.markerIcons.default,
            iconUrl = feature.properties.icon || iconDefaults.icon,
            width = feature.properties.width || iconDefaults.width,
            height = feature.properties.height || iconDefaults.height,
            iconPath = icon + 'width' + width + 'height' + height,
            icon = featureIcons[iconPath];

        if(!icon){
            icon = new L.icon({
                iconUrl: iconUrl,
                iconSize: [width, height],
                iconAnchor: [width/2, height],// offset from the top left corner.half the size of the width and then the entire value of the height to use the correct pin position.
                popupAnchor: [0, (height * -1)]// make pop up originate elsewhere instead of the actual point.
            });

            featureIcons[iconPath] = icon;
        }

        return icon;
    }

    function getClusterStyle(cluster){
        var count = cluster.getChildCount(),
            size,
            icon = clusterStyles[count];

        if(!icon){
            if(count < 10){
                size = 'small';
            } else if(count < 99){
                size = 'medium';
            } else {
                size = 'large';
            }

            icon = new L.DivIcon({
                iconSize: [20, 20],
                html: clusterTemplate({
                    count: count,
                    size: size
                })
            });

            clusterStyles[count] = icon;
        }

        return icon;
    }
});