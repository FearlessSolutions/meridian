define([
    './../map-api-publisher',
    './base',
    './clustering',
    './heatmap',
    './../libs/openlayers-2.13.1/OpenLayers',
    './../libs/Heatmap/Heatmap'
], function(publisher, mapBase, mapClustering, mapHeatmap){
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;

        },
        createStaticLayers: function(params) {

            //Create geolocator layer options
            var geolocatorParams = {
                "map": params.map,
                "layerId": "static_geolocator",
                "styleMap": new OpenLayers.StyleMap({
                    "externalGraphic": "${icon}",
                    "graphicHeight": "${height}",
                    "graphicWidth":  "${width}",
                    "graphicYOffset": context.sandbox.mapConfiguration.markerIcons.default.graphicYOffset || 0
                })
            };
            var geolocatorLayer = exposed.createVectorLayer(geolocatorParams);
            addGeoLocatorListeners({
                "map": params.map,
                "layer": geolocatorLayer
            });

            //Create draw layer options
            var drawParams = {
                "map": params.map,
                "layerId": "static_draw",
                "styleMap": new OpenLayers.StyleMap({
                    "default": {
                        "fillOpacity": 0.05,
                        "strokeOpacity": 1
                    }
                })
            };
            var drawLayer = exposed.createVectorLayer(drawParams);
            addDrawListeners({
                "map": params.map,
                "layer": drawLayer
            });

            //Create heatmap layer options
            var heatmapParams = {
                "map": params.map,
                "layerId": "static_heatmap",
                "renderers": ['Heatmap'],
                "styleMap": new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        "pointRadius": 10,
                        "weight": "${weight}" // The 'weight' of the point (between 0.0 and 1.0), used by the heatmap renderer
                    }, {
                        "context": {
                            weight: function(f) {
                                return 0.05; // Math.min(Math.max((f.attributes.duration || 0) / 43200, 0.25), 1.0);
                            }
                        }
                    })
                })
            };
            var heatmapLayer = exposed.createVectorLayer(heatmapParams);

            params.map.addLayers([geolocatorLayer, drawLayer, heatmapLayer]);
            mapBase.addLayerToSelector({
                "map": params.map,
                "layer": geolocatorLayer
            });

        },
        createVectorLayer: function(params) { // TODO: add support for taking in params.name

            var options = {
                "layerId": params.layerId,
                "styleMap": params.styleMap
            };

            context.sandbox.utils.extend(options, params);
            delete(options.map); // ensure that the map object is not on the options; delete it if it came across in the extend. (If present the layer creation has issues)

            var newVectorLayer = new OpenLayers.Layer.Vector(
                params.layerId,
                options
            );

            var initialVisibility = (context.sandbox.stateManager.map.visualMode === 'heatmap') ? false : true;
            newVectorLayer.setVisibility(initialVisibility);

            params.map.addLayers([newVectorLayer]);

            var selector = params.map.getControlsByClass('OpenLayers.Control.SelectFeature')[0];
            var layers = selector.layers;
            layers.push(newVectorLayer);
            selector.setLayer(layers);

            // Default of new layer is visible = true
            context.sandbox.stateManager.layers[params.layerId] = {"visible": true};

            return newVectorLayer;
        },
        createOSMLayer: function(params) {
            var baseLayer = new OpenLayers.Layer.OSM(params.label,params.url);
            params.map.addLayer(baseLayer);
            return baseLayer;
        },
        createWMSLayer: function(params) {
            
        },
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
                "tileSize": new OpenLayers.Size(
                    params.tileWidth || 256,
                    params.tileHeight || 256
                )
            });
            params.map.addLayer(baseLayer);
            return baseLayer;
        },
        deleteLayer: function() {
            
        },
        clearLayer: function(params) {
            params.map.getLayersBy('layerId', params.layerId)[0].removeAllFeatures();
        },
        hideLayer: function(params) {
            context.sandbox.stateManager.layers[params.layerId].visible = false;
            mapClustering.update({
                "map": params.map
            });
            mapHeatmap.update({
                "map": params.map
            });
        },
        showLayer: function(params) {
            context.sandbox.stateManager.layers[params.layerId].visible = true;
            mapClustering.update({
                "map": params.map
            });
            mapHeatmap.update({
                "map": params.map
            });
        },
        hideAllDataLayers: function(params) {
            //this will iterate through every backbone collection. Each collection is a query layer with the key being the queryId.
            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(queryId, collections){
                exposed.hideLayer({
                    "map": params.map,
                    "layerId": queryId
                });
            });
        },
        showAllDataLayers: function(params) {
            //this will iterate through every backbone collection. Each collection is a query layer with the key being the queryId.
            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(queryId, collections){
                exposed.showLayer({
                    "map": params.map,
                    "layerId": queryId
                });
            });
        },
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
        clear: function(params) {
            var layers = params.map.getLayersByClass('OpenLayers.Layer.Vector');
            layers.forEach(function(layer){
                layer.destroy();              
            });
            context.sandbox.stateManager.layers = {};
        },
        addEventListenersToLayer: function(params){
            if(params.eventListeners) {
                params.layer.events.on(params.eventListeners);
            } else {
                addDefaultListeners({
                    "map": params.map,
                    "layer": params.layer
                });
            }
        },
        loadBasemaps: function(params) {
            var basemapLayers = {};

            context.sandbox.utils.each(context.sandbox.mapConfiguration.basemaps, function(basemap){
                var baseLayer;

                switch (context.sandbox.mapConfiguration.basemaps[basemap].type){
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
                            "tileSize": new OpenLayers.Size(
                                context.sandbox.mapConfiguration.basemaps[basemap].tileWidth || 256,
                                context.sandbox.mapConfiguration.basemaps[basemap].tileHeight || 256
                            )
                        });
                        break;
                    default:
                        context.sandbox.logger.error('Did not load basemap. No support for basemap type:', context.sandbox.mapConfiguration.basemaps[basemap].type);
                        break;
                }
                if(baseLayer){
                    basemapLayers[context.sandbox.mapConfiguration.basemaps[basemap].basemap] = baseLayer;
                }
            });

            return basemapLayers;
        },
        setBasemap: function(params) {
            params.map.setBaseLayer(params.basemapLayer);
        }
    };

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

                    publisher.bboxAdded(coords);
                }

                if(params.layer.features.length > 1) {
                    params.layer.removeFeatures([params.layer.features[0]]);
                }
            }
        });
    }

    // TODO - add default listeners for default looking default popups for when in default clustering default mode on default layer in the default map
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
                    formattedAttributes = {};

                if (!feature.cluster){

                    context.sandbox.dataStorage.getFeatureById({"featureId": feature.featureId}, function(fullFeature){
                        infoWinTemplateRef = context.sandbox.dataServices[feature.attributes.dataService].infoWinTemplate;
                        context.sandbox.utils.each(fullFeature.properties,
                            function(k, v){
                                if((context.sandbox.utils.type(v) === "string" ||
                                    context.sandbox.utils.type(v) === "number" ||
                                    context.sandbox.utils.type(v) === "boolean")) {
                                    formattedAttributes[k] = v;
                                }
                        });
                        popup = new OpenLayers.Popup.FramedCloud('popup',
                            OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                            null,
                            infoWinTemplateRef.buildInfoWinTemplate(formattedAttributes),
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
                        feature.popup = popup;
                        params.map.addPopup(popup);
                        infoWinTemplateRef.postRenderingAction(feature, feature.layer.layerId);
                    });
                } else {
                    var bounds = feature.geometry.getBounds();
                    feature.cluster.forEach(function(point){
                        bounds.extend(point.geometry.getBounds());
                    });
                    var zoom = params.map.getZoomForExtent(bounds);

                    // To prevent zooming in too far
                    // Sources don't always provide the correct information
                    // as to what levels they have imagery for.
                    //
                    // Clicking a cluster should never zoom the user out.
                    var maxAuto = context.sandbox.mapConfiguration.maxAutoZoomLevel;
                    if (zoom > maxAuto){
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
                if (!feature.cluster){
                    params.map.removePopup(feature.popup);
                    feature.popup.destroy();
                    feature.popup = null;
                }
            }
        });
    }

    return exposed;
});