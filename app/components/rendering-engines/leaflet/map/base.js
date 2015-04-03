define([
    './../map-api-publisher',
    './../libs/leaflet-src'
], function(publisher) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        /**
         * Create the basic map and set default values for initial viewport
         * @param params
         * @returns {OpenLayers.Map}
         */
        createMap: function(params) {
            var mapElement,
                map,
                showCursorLocationDefault = true;
                
            mapElement = (params && params.el) ? params.el : 'map';

            // exposed.addSelector({
            //     "map": map
            // });

            //must set center and zoom before manipulating the map.
            map = L.map(mapElement, {
                zoomControl: false, //remoe the native +/- zoom controls.
                attributionControl: false, //remove the attribution section of the map.
                center: [0,0],
                zoom: 4,
                minZoom: 2,
                maxZoom: context.sandbox.mapConfiguration.maxAutoZoomLevel
            });

            //Check user settings for default setting to display cursor location
            if(
                context.sandbox.cursorLocation && 
                typeof context.sandbox.cursorLocation.defaultDisplay !== undefined
            ){
                showCursorLocationDefault = context.sandbox.cursorLocation.defaultDisplay; 
            }

            if(
                context.sandbox.mapConfiguration.cursorLocation && 
                context.sandbox.mapConfiguration.cursorLocation.defaultDisplay && 
                showCursorLocationDefault
            ){
                exposed.trackMousePosition({
                    "map": map
                });
            }

            //Set initial value of map extent, in the state manager
            context.sandbox.stateManager.setMapExtent({
                "extent": {
                    "minLon": context.sandbox.mapConfiguration.initialMinLon,
                    "minLat": context.sandbox.mapConfiguration.initialMinLat,
                    "maxLon": context.sandbox.mapConfiguration.initialMaxLon,
                    "maxLat": context.sandbox.mapConfiguration.initialMaxLat
                }
            });

            //Listen for map movents and update the map extent in the state manager
            map.on('moveend', function(evt) {
                var currentExtent = map.getBounds();
                context.sandbox.stateManager.setMapExtent({
                    "extent": {
                        "minLon": currentExtent.getWest(),
                        "minLat": currentExtent.getSouth(),
                        "maxLon": currentExtent.getEast(),
                        "maxLat": currentExtent.getNorth()
                    }
                });
            });

            // map.events.register('zoomend', map, function(evt) {
            //     // Basic cleanup for things on the map when zoom changes... can adjust later as needed
            //     exposed.clearMapSelection({
            //         "map": map
            //     });
            //     exposed.clearMapPopups({
            //         "map": map
            //     });
            // });

            return map;
        },
        addSelector: function(params) {
            var selector = new OpenLayers.Control.SelectFeature([], {
                "click": true,
                "autoActivate": true
            });
            params.map.addControl(selector);
        },
        addLayerToSelector: function(params) {
            var selector = params.map.getControlsByClass('OpenLayers.Control.SelectFeature')[0];
            selector.setLayer([params.layer]);
        },
        removeAllSelectors: function(params) {
            var controls = params.map.getControlsByClass('OpenLayers.Control.SelectFeature');
            controls.forEach(function(control) {
                control.destroy();
            });
        },
        resetSelector: function(params) {
            exposed.clearMapSelection({
                "map": params.map
            });
            exposed.clearMapPopups({
                "map": params.map
            });
            exposed.removeAllSelectors({
                "map": params.map
            });
            exposed.addSelector({
                "map": params.map
            });
        },
        clearMapSelection: function(params) {
            var controls = params.map.getControlsByClass('OpenLayers.Control.SelectFeature');
            controls.forEach(function(control) {
                control.unselectAll();
            });
        },
        trackMousePosition: function(params) {
            params.map.on('mousemove', function(e) {
                var position = e.latlng;
                publisher.publishMousePosition({
                    "lat": position.lat,
                    "lon": position.lng
                });
            });
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

            anchor = {"size": new OpenLayers.Size(0, 0), "offset": new OpenLayers.Pixel(0, -(feature.attributes.height/2))};
            popup = new OpenLayers.Popup.FramedCloud(
                'popup',
                OpenLayers.LonLat.fromString(feature.geometry.toShortString()), //TODO centroid
                null,
                params.content,
                anchor,
                true,
                function() {
                    exposed.clearMapSelection({
                        "map": params.map
                    });
                    exposed.clearMapPopups({
                        "map": params.map
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
            exposed.clearMapPopups({
                "map": params.map
            });
        }
    };
    return exposed;
});