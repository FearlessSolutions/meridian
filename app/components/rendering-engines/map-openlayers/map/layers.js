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
        createGlobalLayers: function(params) {

            //Create geolocator layer options
            var geolocatorParams = {
                "map": params.map,
                "layerId": "global_geolocator",
                "styleMap": new OpenLayers.StyleMap({
                    "externalGraphic": "${icon}",
                    "graphicHeight": "${height}",
                    "graphicWidth":  "${width}"
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
                "layerId": "global_draw",
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
                "layerId": "global_heatmap",
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
            delete(options.map);

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
        createWMSLayer: function(params) {
            
        },
        createWMTSLayer: function(params) {
            
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
            mapHeatmap.update({
                "map": params.map
            });
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

    return exposed;
});