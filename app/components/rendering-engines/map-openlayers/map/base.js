define([
    './../map-api-publisher',
    './../libs/openlayers-2.13.1/OpenLayers'
], function(publisher){
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        createMap: function(params) {
            var mapElement,
                map,
                showCursorLocationDefault = true;
                
            mapElement = (params && params.el) ? params.el : 'map';
            map = new OpenLayers.Map(mapElement,{
                controls: [new OpenLayers.Control.Navigation()],
                projection: new OpenLayers.Projection(context.sandbox.mapConfiguration.projection),
                projectionWGS84: new OpenLayers.Projection('EPSG:4326')
            });

            exposed.addSelector({
                "map": map
            });

            // Check user settings for default setting to display cursor location
            if(context.sandbox.cursorLocation && 
                typeof context.sandbox.cursorLocation.defaultDisplay !== undefined) {
                showCursorLocationDefault = context.sandbox.cursorLocation.defaultDisplay; 
            }

            // TODO: Why use cooridnates.startOn as the var name?
            if(context.sandbox.mapConfiguration.coordinates && context.sandbox.mapConfiguration.coordinates.startOn && showCursorLocationDefault){
                exposed.trackMousePosition({
                    "map": map
                });
            }

            // Set initial value of map extent, in the state manager
            context.sandbox.stateManager.setMapExtent({
                "extent": {
                    "minLon": context.sandbox.mapConfiguration.initialMinLon,
                    "minLat": context.sandbox.mapConfiguration.initialMinLat,
                    "maxLon": context.sandbox.mapConfiguration.initialMaxLon,
                    "maxLat": context.sandbox.mapConfiguration.initialMaxLat
                }
            });

            // Listen for map movents and update the map extent in the state manager
            map.events.register('moveend', map, function(evt) {
                var currentExtent = map.getExtent().transform(map.projection, map.projectionWGS84);
                context.sandbox.stateManager.setMapExtent({
                    "extent": {
                        "minLon": currentExtent.left,
                        "minLat": currentExtent.bottom,
                        "maxLon": currentExtent.right,
                        "maxLat": currentExtent.top
                    }
                });
            });

            map.events.register('zoomend', map, function(evt) {
                // Basic cleanup for things on the map when zoom changes... can adjust later as needed
                exposed.clearMapSelection({
                    "map": map
                });
                exposed.clearMapPopups({
                    "map": map
                });
            });

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
        clearMapSelection: function(params) { //TODO: Look at renaming function to unselectAll or something like that
            var controls = params.map.getControlsByClass('OpenLayers.Control.SelectFeature');
            controls.forEach(function(control) {
                control.unselectAll();
            });
        },
        trackMousePosition: function(params){
            params.map.events.register('mousemove', params.map, function(e){
                var position = this.events.getMousePosition(e);
                var latlon = exposed.getMouseLocation({
                    "map": params.map,
                    "position": position
                });
                publisher.publishMousePosition({
                    "lat": latlon.lat,
                    "lon": latlon.lon
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
        },
        identifyFeature: function(params) {
            var popup,
                feature = params.feature,
                anchor;


            anchor= {"size": new OpenLayers.Size(0,0), "offset": new OpenLayers.Pixel(0,-(feature.attributes.height/2))};
            popup = new OpenLayers.Popup.FramedCloud(
                'popup',
                OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
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