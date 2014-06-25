define([
    './base',
    './../libs/openlayers-2.13.1/OpenLayers'
], function(mapBase){
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;

        },
        createGlobalLayers: function(params) {

            //Create geolocator layer
            var geolocatorLayer = createGeolocatorLayer(params);

            //Create draw layer
            var drawLayer = createDrawLayer(params);

            params.map.addLayers([geolocatorLayer, drawLayer]);
            mapBase.addLayerToSelector({
                "map": params.map,
                "layer": geolocatorLayer
            });

        },
        create: function(params) {
            
        },
        delete: function() {
            
        },
        clear: function() {
            
        },
        hide: function() {
            
        },
        show: function() {
            
        },
        hideAllDataLayers: function() {
            
        },
        showAllDataLayers: function() {
            
        }
    };

    function createGeolocatorLayer(params) {
        var geolocatorLayer = new OpenLayers.Layer.Vector('global_geolocator', {
            layerId: 'global_geolocator',
            styleMap: new OpenLayers.StyleMap({
                externalGraphic: '${icon}',
                graphicHeight: '${height}',
                graphicWidth:  '${width}'
            }),
            eventListeners: {
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
            } 
        });
        return geolocatorLayer;
    }

    // TODO: Split the control func into the drawing.js file and the boxLayer converts to more generic drawing func.
    function createDrawLayer(params) {
        var boxLayer,
            boxControl,
            initialVisibility;
        
        if(params.map.getLayersBy('id', 'drawingBox').length === 0) {
            boxLayer = new OpenLayers.Layer.Vector('drawingBox', {
                styleMap: new OpenLayers.StyleMap({'default':
                    {
                        fillOpacity: 0.05,
                        strokeOpacity: 1
                    }
                })
            });
            boxLayer.events.on({
                'featureadded': function(evt) {
                    var feature = evt.feature;
                    feature.attributes = feature.attributes || {};
                    feature.attributes.box = 'query';
                    bboxAdded({feature: evt.feature});
                    if(boxLayer.features.length > 1) {
                        boxLayer.removeFeatures([boxLayer.features[0]]);
                    }
                }
            });

            boxLayer.id = 'drawingBox';
            params.map.addLayers([boxLayer]);
            
            boxControl = new OpenLayers.Control.DrawFeature(boxLayer,
                OpenLayers.Handler.RegularPolygon, {
                    handlerOptions: {sides: 4, irregular: true}
                }
            );
            
            boxControl.id = 'queryDrawingControl';
            boxLayer.attributes = boxLayer.attributes || {};
            boxLayer.attributes.name = 'BoxLayer';

            params.map.addControls([boxControl]);              
            
        } else {
            boxLayer = params.map.getLayersBy('id', 'drawingBox')[0];
            boxControl = params.map.getControlsBy('id', 'queryDrawingControl')[0];
        }    
        
        boxControl.activate();

        publisher.publishMessage({
            messageType: 'info',
            messageTitle: 'Drawing',
            messageText: 'Draw a bounding box on the map to gather coordinates.'
        });

        context.$('#map').css('cursor', 'crosshair');

        function bboxAdded(data) {
            var feature,
                bBoxToString,
                splitBbs,
                coords;

            if(data.feature) {
                feature = data.feature;
                bBoxToString = reprojectTo(feature.geometry.bounds).toBBOX();
                splitBbs = bBoxToString.split(',');
                coords = {
                    minLon: splitBbs[0], 
                    minLat: splitBbs[1],
                    maxLon: splitBbs[2],
                    maxLat: splitBbs[3]
                };

                publisher.bboxAdded(coords);
                
                boxControl.deactivate();
                context.$('#map').css('cursor', 'default');
            } else {
                context.sandbox.logger.log('no feature');
            }
        }

        return boxLayer;
    }

    return exposed;
});