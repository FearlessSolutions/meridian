define([
    './../map-api-publisher',
    './base',
    './clustering',
    './../libs/openlayers-2.13.1/OpenLayers'
], function(publisher, mapBase, mapClustering){
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

            params.map.addLayers([geolocatorLayer, drawLayer]);
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

            // TEST - Merge extra parameter options in...
            // 
            // context.sandbox.utils.extend(true, options, params);

            if(params.layerId !== 'global_draw' && params.layerId !== 'global_geolocator') {
                console.warn('should not be here for draw');
                context.sandbox.utils.extend(true, options, params);

                context.sandbox.dataStorage.datasets[params.layerId].visible = true;
                context.sandbox.dataStorage.datasets[params.layerId].visualMode = 'default';
                // context.sandbox.dataStorage.datasets[params.layerId].isHeated = true;
            }

            var newVectorLayer = new OpenLayers.Layer.Vector(
                params.layerId,
                options
            );

            newVectorLayer.setVisibility(true);

            params.map.addLayers([newVectorLayer]);

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
            var layer = params.map.getLayersBy('layerId', params.layerId)[0];
            layer.setVisibility(false);
            context.sandbox.stateManager.layers[params.layerId].visible = false;
        },
        showLayer: function(params) {
            var layer = params.map.getLayersBy('layerId', params.layerId)[0];
            layer.setVisibility(true);
            context.sandbox.stateManager.layers[params.layerId].visible = true;
        },
        hideAllDataLayers: function() {
            
        },
        showAllDataLayers: function() {
            
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
            "featureadded": function(evt) {
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

    return exposed;
});