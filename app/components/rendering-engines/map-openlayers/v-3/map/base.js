define([
    './../libs/v3.0.0/build/ol-debug' //TODO make this 'ol'
], function() {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context,
        mapClustering,
        mapLayers,
        publisher;

    var exposed = {
        init: function(modules) {
            context = modules.context;
            mapClustering = modules.clustering;
            mapLayers = modules.layers;
            publisher = modules.publisher;
        },
        /**
         * Create the basic map and set default values for initial viewport
         * @param params
         * @returns {ol.Map}
         */
        createMap: function(params) {
            var mapElement,
                map,
                showCursorLocationDefault = true;
                
            mapElement = (params && params.el) ? params.el : 'map';
            map = new ol.Map({
                target: mapElement,
                view: new ol.View({
                    projection: 'EPSG:3857',
                    center: [0,0],
                    zoom: 5 //TODO set center?
                })
            });

            map.addInteraction(//,
                new ol.interaction.Select({
                    condition: ol.events.condition.click,
                    layers: function(layer){ //Layers that can be selected will have the 'selectable' property
                        if(layer.get('selectable')){
                            return true;
                        } else{
                            return false;
                        }
                    },
                    style: function(feature, resolution){
                        if(feature.get('features')){ //It is a cluster
                            return mapClustering.getSelectedStyling({
                                feature: feature,
                                resolution: resolution
                            });
                        } else {
                            return mapLayers.getSelectedStyling({
                                feature: feature,
                                resolution: resolution
                            });
                        }
                    }
                })


            );
//
            //TODO
//            exposed.addSelector({
//                map: map
//            });
//
            //TODO
            // Check user settings for default setting to display cursor location
//            if(
//                context.sandbox.cursorLocation &&
//                typeof context.sandbox.cursorLocation.defaultDisplay !== undefined
//            ){
//                showCursorLocationDefault = context.sandbox.cursorLocation.defaultDisplay;
//            }
//
//            if(
//                context.sandbox.mapConfiguration.cursorLocation &&
//                context.sandbox.mapConfiguration.cursorLocation.defaultDisplay &&
//                showCursorLocationDefault
//            ){
//                exposed.trackMousePosition({
//                    map: map
//                });
//            }

            //TODO Why are we doing this here??????
            // Set initial value of map extent, in the state manager
            context.sandbox.stateManager.setMapExtent({
                extent: {
                    minLon: context.sandbox.mapConfiguration.initialMinLon,
                    minLat: context.sandbox.mapConfiguration.initialMinLat,
                    maxLon: context.sandbox.mapConfiguration.initialMaxLon,
                    maxLat: context.sandbox.mapConfiguration.initialMaxLat
                }
            });

            // Listen for map movents and update the map extent in the state manager
            //TODO
//            map.events.register('moveend', map, function(evt) {
//                var currentExtent = map.getExtent().transform(map.projection, map.projectionWGS84);
//                context.sandbox.stateManager.setMapExtent({
//                    extent: {
//                        minLon: currentExtent.left,
//                        minLat: currentExtent.bottom,
//                        maxLon: currentExtent.right,
//                        maxLat: currentExtent.top
//                    }
//                });
//            });
//
            //TODO
//            map.events.register('zoomend', map, function(evt) {
//                // Basic cleanup for things on the map when zoom changes... can adjust later as needed
//                exposed.clearMapSelection({
//                    map: map
//                });
//                exposed.clearMapPopups({
//                    map: map
//                });
//            });

            return map;
        },
        addSelector: function(params) {
            //This is single click (no double-click selection)
            //TODO make sure it is not shift for multi--If it is, change it
            var selector = new ol.interaction.Select([], {
//                click: true, //TODO options
//                autoActivate: true
            });
            params.map.addControl(selector);
        },
        addLayerToSelector: function(params) {
            var selector = params.map.getControlsByClass('ol.Control.SelectFeature')[0];
            selector.setLayer([params.layer]);
        },
        removeAllSelectors: function(params) {
            var controls = params.map.getControlsByClass('ol.Control.SelectFeature');
            controls.forEach(function(control) {
                control.destroy();
            });
        },
        resetSelector: function(params) {
            exposed.clearMapSelection({
                map: params.map
            });
            exposed.clearMapPopups({
                map: params.map
            });
            exposed.removeAllSelectors({
                map: params.map
            });
            exposed.addSelector({
                map: params.map
            });
        },
        clearMapSelection: function(params) {
            var controls = params.map.getControlsByClass('ol.Control.SelectFeature');
            controls.forEach(function(control) {
                control.unselectAll();
            });
        },
        trackMousePosition: function(params) {
            params.map.events.register('mousemove', params.map, function(e) {
                var position = this.events.getMousePosition(e);
                var latlon = exposed.getMouseLocation({
                    map: params.map,
                    position: position
                });
                publisher.publishMousePosition({
                    lat: latlon.lat,
                    lon: latlon.lon
                });
            });
        },
        getMouseLocation: function(params) {
            return params.map.getLonLatFromPixel(params.position).transform(params.map.projection, params.map.projectionWGS84);
        },
        clearMapPopups: function(params) {
            while(params.map.popups.length) {
                params.map.removePopup(params.map.popups[0]);
            }

            context.sandbox.stateManager.removeAllIdentifiedFeatures();
        },
        identifyFeature: function(params) { // TODO: what is this being used by? A: Nothing right now. There isn't even a subscriber.
            var popup,
                feature = params.feature,
                anchor;

            anchor = {size: new ol.Size(0, 0), offset: new ol.Pixel(0, -(feature.attributes.height/2))};
            popup = new ol.Popup.FramedCloud(
                'popup',
                ol.LonLat.fromString(feature.geometry.toShortString()), //TODO centroid
                null,
                params.content,
                anchor,
                true,
                function() {
                    exposed.clearMapSelection({
                        map: params.map
                    });
                    exposed.clearMapPopups({
                        map: params.map
                    });
                }
            );

            feature.popup = popup;
            params.map.addPopup(popup);
        },
        setVisualMode: function(params) {
            if(params && params.mode) {
                context.sandbox.stateManager.map.visualMode = params.mode;
            }
//            exposed.clearMapPopups({
//                map: params.map
//            });
        }
    };
    return exposed;
});