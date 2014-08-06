define([
    './../map-api-publisher',
    './base',
    './clustering',
    './heatmap',
    './../libs/openlayers-2.13.1/OpenLayers',
    './../libs/Heatmap/Heatmap'
], function(publisher, mapBase, mapClustering, mapHeatmap) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;

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
                "map": params.map,
                "layerId": "static_geolocator",
                "static": true,
                "styleMap": {
                    "externalGraphic": "${icon}",
                    "graphicHeight": "${height}",
                    "graphicWidth":  "${width}",
                    "graphicYOffset": context.sandbox.mapConfiguration.markerIcons.default.graphicYOffset || 0
                }
            };
            geolocatorLayer = exposed.createVectorLayer(geolocatorParams);
            addGeoLocatorListeners({
                "map": params.map,
                "layer": geolocatorLayer
            });

            //Create draw layer options
            drawParams = {
                "map": params.map,
                "layerId": "static_draw",
                "static": true,
                "styleMap": {
                    "default": {
                        "fillOpacity": 0.05,
                        "strokeOpacity": 1
                    }
                }
            };
            drawLayer = exposed.createVectorLayer(drawParams);
            addDrawListeners({
                "map": params.map,
                "layer": drawLayer
            });

            //Create heatmap layer options
            heatmapParams = {
                "map": params.map,
                "layerId": "static_heatmap",
                "renderers": ['Heatmap'],
                "static": true,
                "styleMap": {
                    "default": new OpenLayers.Style({
                        "pointRadius": 10,
                        // The 'weight' of the point (between 0.0 and 1.0), used by the heatmap renderer.
                        // The weight is calcluated by the context.weight function below.
                        "weight": "${weight}"
                    }, {
                        "context": {
                            weight: function() {
                                var visibleDataRecordCount = 0;
                                // Build the visibleDataRecordCount by adding all records from datasets that are visible
                                context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, value) {
                                    if(context.sandbox.stateManager.layers[key] && context.sandbox.stateManager.layers[key].visible) {
                                        visibleDataRecordCount += value.length;
                                    }
                                });
                                // Set initial weight value to 0.1,
                                // once there are more than 10k records it will decrease by 0.01 per 1k records, 
                                // stopping at a lowest weight of 0.01 at 100k records (it will not go lower, even if more than 100k records)
                                return Math.max(Math.min(1000 / visibleDataRecordCount, 0.1), 0.01);
                            }
                        }
                    })
                }
            };
            heatmapLayer = exposed.createVectorLayer(heatmapParams);

            params.map.addLayers([geolocatorLayer, drawLayer, heatmapLayer]);
            mapBase.addLayerToSelector({
                "map": params.map,
                "layer": geolocatorLayer
            });

        },
        /**
         * Create new vector layer
         * @param params {
         *      styleMap - Style map for just this layer
         *      layerId - Id for this layer (must be unique).
         *      selectable - If this layer's features should be interactive
         * }
         * @returns {OpenLayers.Layer.Vector}
         */
        createVectorLayer: function(params) {
            var options,
                newVectorLayer,
                selector,
                layers;

            options = {
                "layerId": params.layerId, // set as layerId, is not present its null
                "styleMap": null  // set as null for default of not providing a stylemap
            };

            context.sandbox.utils.extend(options, params);
            if(params.styleMap) {
                options.styleMap = new OpenLayers.StyleMap(params.styleMap);
            }

            delete(options.map); // ensure that the map object is not on the options; delete it if it came across in the extend. (If present the layer creation has issues)

            newVectorLayer = new OpenLayers.Layer.Vector(
                params.layerId,
                options
            );

            if(context.sandbox.dataStorage.datasets[params.layerId] && context.sandbox.stateManager.map.visualMode === 'heatmap') {
                newVectorLayer.setVisibility(false);
            }

            params.map.addLayers([newVectorLayer]);

            if(params.selectable) {
                selector = params.map.getControlsByClass('OpenLayers.Control.SelectFeature')[0];
                layers = selector.layers;
                layers.push(newVectorLayer);
                selector.setLayer(layers);
            }

            // Default of new layer is visible = true
            context.sandbox.stateManager.layers[params.layerId] = {"visible": true};

            return newVectorLayer;
        },
        /**
         * Add base layer of OSM format
         * @param params
         * @returns {OpenLayers.Layer.OSM}
         */
        createOSMLayer: function(params) {
            var baseLayer = new OpenLayers.Layer.OSM(params.label,params.url);
            params.map.addLayer(baseLayer);
            return baseLayer;
        },
        /**
         * Create baselayer of WMTS format
         * @param params
         * @returns {OpenLayers.Layer.WMTS}
         */
        createWMTSLayer: function(params) {
            var baseLayer = new OpenLayers.Layer.WMTS({
                "name": params.name,
                "url": params.url,
                "style": params.style,
                "matrixSet": params.matrixSet || context.sandbox.mapConfiguration.projection,
                "matrixIds": params.matrixIds || null,
                "layer": params.layer || null,
                "requestEncoding": params.requestEncoding || 'KVP',
                "format": params.format || 'image/jpeg',
                "resolutions": params.resolutions || null,
                "wrapDateLine": ("wrapDateLine" in params) ? params.wrapDateLine : true,
                "tileSize": new OpenLayers.Size(
                    params.tileWidth || 256,
                    params.tileHeight || 256
                )
            });
            params.map.addLayer(baseLayer);
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
            var selector = params.map.getControlsByClass('OpenLayers.Control.SelectFeature')[0],
                layers = selector.layers,
                index;

            mapBase.clearMapSelection({
                "map": params.map
            });
            mapBase.clearMapPopups({
                "map": params.map
            });

            delete context.sandbox.stateManager.layers[params.layerId];
            params.map.removeLayer(params.map.getLayersBy('layerId', params.layerId)[0]);


            context.sandbox.utils.each(layers, function(key, value) {
                if(value.layerId === params.layerId) {
                    layers.splice(key, 1);
                    return false;
                }
            });
            selector.setLayer(layers);

            mapClustering.deleteClusteringLayerOptions({
                "layerId": params.layerId
            });

            mapClustering.update({
                "map": params.map
            });
            mapHeatmap.update({
                "map": params.map
            });
        },
        /**
         * Remove all of the features from a layer, but leave the layer
         * @param params
         */
        clearLayer: function(params) {
            params.map.getLayersBy('layerId', params.layerId)[0].removeAllFeatures();
        },
        hideLayer: function(params) {
            var currentLayer;

            mapBase.clearMapSelection({
                "map": params.map
            });
            mapBase.clearMapPopups({
                "map": params.map
            });

            if(context.sandbox.stateManager.layers[params.layerId] && context.sandbox.dataStorage.datasets[params.layerId]) {
                context.sandbox.stateManager.layers[params.layerId].visible = false;
                mapClustering.update({
                    "map": params.map
                });
                mapHeatmap.update({
                    "map": params.map
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

            mapBase.clearMapSelection({
                "map": params.map
            });
            mapBase.clearMapPopups({
                "map": params.map
            });

            if(context.sandbox.stateManager.layers[params.layerId] && context.sandbox.dataStorage.datasets[params.layerId]) {
                context.sandbox.stateManager.layers[params.layerId].visible = true;
                mapClustering.update({
                    "map": params.map
                });
                mapHeatmap.update({
                    "map": params.map
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
            var selector = params.map.getControlsByClass('OpenLayers.Control.SelectFeature')[0];
            selector.unselectAll();
            mapClustering.update({
                "map": params.map
            });
            mapClustering.visualModeChanged({
                "mode": params.mode
            });
            mapHeatmap.update({
                "map": params.map
            });
        },
        /**
         * Clear all features and feature layers
         * @param params
         */
        clear: function(params) {
            var layers = params.map.getLayersByClass('OpenLayers.Layer.Vector');
            layers.forEach(function(layer) {
                layer.destroy();              
            });
            context.sandbox.stateManager.layers = {};
            mapClustering.clear();
            mapHeatmap.clear({
                "map": params.map
            });
        },
        addEventListenersToLayer: function(params) {
            if(params.eventListeners) {
                params.layer.events.on(params.eventListeners);
            } else {
                addDefaultListeners({
                    "map": params.map,
                    "layer": params.layer
                });
            }
        },
        /**
         * Load basemaps, as defined in the map configuration. Accepts OSM and WMTS
         * @param params
         * @returns {{}}
         */
        loadBasemaps: function(params) {
            var basemapLayers = {};

            context.sandbox.utils.each(context.sandbox.mapConfiguration.basemaps, function(basemap) {
                var baseLayer;

                switch (context.sandbox.mapConfiguration.basemaps[basemap].type) {
                    case "osm":
                        baseLayer = exposed.createOSMLayer({
                            "map": params.map,
                            "label": context.sandbox.mapConfiguration.basemaps[basemap].label,
                            "url": [context.sandbox.mapConfiguration.basemaps[basemap].url]
                        });
                        break;
                    case "wmts":
                        baseLayer = exposed.createWMTSLayer({
                            "map": params.map,
                            "name": context.sandbox.mapConfiguration.basemaps[basemap].name,
                            "url": context.sandbox.mapConfiguration.basemaps[basemap].url,
                            "style": context.sandbox.mapConfiguration.basemaps[basemap].style,
                            "matrixSet": context.sandbox.mapConfiguration.basemaps[basemap].matrixSet || context.sandbox.mapConfiguration.projection,
                            "matrixIds": context.sandbox.mapConfiguration.basemaps[basemap].matrixIds || null,
                            "layer": context.sandbox.mapConfiguration.basemaps[basemap].layer || null,
                            "requestEncoding": context.sandbox.mapConfiguration.basemaps[basemap].requestEncoding || 'KVP',
                            "format": context.sandbox.mapConfiguration.basemaps[basemap].format || 'image/jpeg',
                            "resolutions": context.sandbox.mapConfiguration.basemaps[basemap].resolutions || null,
                            "wrapDateLine": ("wrapDateLine" in context.sandbox.mapConfiguration.basemaps[basemap]) ? context.sandbox.mapConfiguration.basemaps[basemap].wrapDateLine : true,
                            "tileWidth": context.sandbox.mapConfiguration.basemaps[basemap].tileWidth || context.sandbox.mapConfiguration.defaultTileWidth,
                            "tileHeight": context.sandbox.mapConfiguration.basemaps[basemap].tileHeight || context.sandbox.mapConfiguration.defaultTileHeight
                        });
                        break;
                    default:
                        context.sandbox.logger.error('Did not load basemap. No support for basemap type:', context.sandbox.mapConfiguration.basemaps[basemap].type);
                        break;
                }
                if(baseLayer) {
                    basemapLayers[context.sandbox.mapConfiguration.basemaps[basemap].basemap] = baseLayer;
                }
            });

            return basemapLayers;
        },
        setBasemap: function(params) {
            params.map.setBaseLayer(params.basemapLayer);
        },
        /**
         * Add popup to feature, even if it is in a cluster
         * @param params
         */
        identifyFeature: function(params) {
            var layer = params.map.getLayersBy('layerId', params.layerId)[0],
                feature = layer.getFeatureBy('featureId', params.featureId),
                clusterFeatureId,
                clusterFeatureCount,
                record,
                currentDataService;

            //If no feature is found, it is most likely because it was hidden in a cluster
            if(!feature) {
                context.sandbox.utils.each(layer.features, function(k1, v1) {
                    if(v1.cluster) {
                        context.sandbox.utils.each(v1.cluster, function(k2, v2) {
                            if(params.featureId === v2.featureId) {
                                feature = v1;
                                record = v2;
                                clusterFeatureId = k2 + 1;
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
                            headerHTML = '<span>' + clusterFeatureId + ' of ' + clusterFeatureCount + '</span>',
                            formattedAttributes = {},
                            bounds,
                            popup;

                        context.sandbox.utils.each(fullFeature.properties, 
                            function(key, value) {
                                if((context.sandbox.utils.type(value) === "string" ||
                                    context.sandbox.utils.type(value) === "number" ||
                                    context.sandbox.utils.type(value) === "boolean")) {
                                    formattedAttributes[key] = value;
                                }
                        });
                        popup = new OpenLayers.Popup.FramedCloud('popup',
                            OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                            null,
                            headerHTML + infoWinTemplateRef.buildInfoWinTemplate(
                                formattedAttributes,
                                fullFeature
                            ),
                            null,
                            true,
                            function() {
                                mapBase.clearMapSelection({
                                    "map": params.map
                                });
                                mapBase.clearMapPopups({
                                    "map": params.map
                                });
                            }
                        );
                        popup.layerId = params.layerId;

                        mapBase.clearMapSelection({
                            "map": params.map
                        });
                        mapBase.clearMapPopups({
                            "map": params.map
                        });

                        bounds = feature.geometry.getBounds();
                        params.map.setCenter(bounds.getCenterLonLat());

                        feature.popup = popup;
                        params.map.addPopup(popup);

                        context.sandbox.dataServices[currentDataService].infoWinTemplate.postRenderingAction(
                            record,
                            layer.layerId
                        );
                    }
                );
            } else {
                var popup,
                    infoWinTemplateRef,
                    formattedAttributes = {},
                    anchor;
                context.sandbox.dataStorage.getFeatureById({"featureId": feature.featureId}, function(fullFeature) {
                    infoWinTemplateRef = context.sandbox.dataServices[feature.attributes.dataService].infoWinTemplate;
                    context.sandbox.utils.each(fullFeature.properties,
                        function(key, value) {
                            if((context.sandbox.utils.type(value) === "string" ||
                                context.sandbox.utils.type(value) === "number" ||
                                context.sandbox.utils.type(value) === "boolean"
                            )) {
                                formattedAttributes[key] = value;
                            }
                    });
                    
                    anchor= {"size": new OpenLayers.Size(0,0), "offset": new OpenLayers.Pixel(0,-(feature.attributes.height/2))};
                    popup = new OpenLayers.Popup.FramedCloud('popup',
                        OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                        null,
                        infoWinTemplateRef.buildInfoWinTemplate(formattedAttributes, fullFeature),
                        anchor,
                        true,
                        function() {
                            mapBase.clearMapSelection({
                                "map": params.map
                            });
                            mapBase.clearMapPopups({
                                "map": params.map
                            });
                        }
                    );

                    mapBase.clearMapSelection({
                        "map": params.map
                    });
                    mapBase.clearMapPopups({
                        "map": params.map
                    });

                    feature.popup = popup;
                    params.map.addPopup(popup);
                    infoWinTemplateRef.postRenderingAction(feature, feature.layer.layerId);
                });
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
                    "map": params.map
                });
                mapBase.clearMapPopups({
                    "map": params.map
                });
            },
            featureselected: function(evt) {
                var latLonString = evt.feature.geometry.clone().transform(params.map.projection, params.map.projectionWGS84).toShortString();

                mapBase.identifyFeature({
                    "map": params.map,
                    "feature": evt.feature,
                    "content": latLonString
                });
            },
            featureunselected: function(evt) {
                mapBase.clearMapPopups({
                    "map": params.map
                });
            }    
        });
    }

    // TODO: Split the control func into the drawing.js file and the boxLayer converts to more generic drawing func.
    function addDrawListeners(params) {
        params.layer.events.on({
            featureadded: function(evt) {
                var feature = evt.feature,
                    boundingBox,
                    splitBoundingBox,
                    coords;

                feature.attributes = feature.attributes || {};

                if(feature) {
                    boundingBox = feature.geometry.bounds.transform(params.map.projection, params.map.projectionWGS84).toBBOX();
                    splitBoundingBox = boundingBox.split(',');
                    coords = {
                        "minLon": splitBoundingBox[0], 
                        "minLat": splitBoundingBox[1],
                        "maxLon": splitBoundingBox[2],
                        "maxLat": splitBoundingBox[3]
                    };

                    publisher.stopDrawing(coords);
                }

                if(params.layer.features.length > 1) {
                    params.layer.removeFeatures([params.layer.features[0]]);
                }
            }
        });
    }

    // TODO: add default listeners for default looking default popups for when in default clustering default mode on default layer in the default map
    function addDefaultListeners(params) {
        params.layer.events.on({
            beforefeatureselected: function(evt) {
                mapBase.clearMapSelection({
                    "map": params.map
                });
                mapBase.clearMapPopups({
                    "map": params.map
                });
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
                        "featureId": feature.featureId}, 
                        function(fullFeature) {
                            if(fullFeature.geometry.type === 'Point') { // TODO: remove check when we support identifying non-point features
                                infoWinTemplateRef = context.sandbox.dataServices[feature.attributes.dataService].infoWinTemplate;
                                context.sandbox.utils.each(fullFeature.properties,
                                    function(k, v) {
                                        if((context.sandbox.utils.type(v) === "string" ||
                                            context.sandbox.utils.type(v) === "number" ||
                                            context.sandbox.utils.type(v) === "boolean")) {
                                            formattedAttributes[k] = v;
                                        }
                                });

                                anchor= {"size": new OpenLayers.Size(0, 0), "offset": new OpenLayers.Pixel(0, -(feature.attributes.height/2))};
                                popup = new OpenLayers.Popup.FramedCloud('popup',
                                    OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                                    null,
                                    infoWinTemplateRef.buildInfoWinTemplate(
                                        formattedAttributes,
                                        fullFeature
                                    ),
                                    anchor,
                                    true,
                                    function() {
                                        mapBase.clearMapSelection({
                                            "map": params.map
                                        });
                                        mapBase.clearMapPopups({
                                            "map": params.map
                                        });
                                    }
                                );
                                feature.popup = popup;
                                params.map.addPopup(popup);
                                infoWinTemplateRef.postRenderingAction(feature, feature.layer.layerId);
                            }
                        } 
                    );
                } else {
                    bounds = feature.geometry.getBounds();
                    feature.cluster.forEach(function(point) {
                        bounds.extend(point.geometry.getBounds());
                    });
                    zoom = params.map.getZoomForExtent(bounds);

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
            },
            featureunselected: function(evt) {
                var feature = evt.feature;

                if(!feature.cluster) {
                    context.sandbox.dataStorage.getFeatureById({
                        "featureId": feature.featureId}, 
                        function(fullFeature) {
                            if(fullFeature.geometry.type === 'Point') { // TODO: remove check when we support identifying non-point features
                                params.map.removePopup(feature.popup);
                                feature.popup.destroy();
                                feature.popup = null;
                            }
                        }
                    );
                }
            }
        });
    }

    return exposed;
});