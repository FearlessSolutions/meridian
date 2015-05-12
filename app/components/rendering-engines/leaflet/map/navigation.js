define([
    './../map-api-publisher',
    './layers',
    './../libs/leaflet-src'
], function(publisher, mapLayers) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context,
        map;

    var exposed = {
        init: function(thisContext, thisMap) {
            var cursorLocation;
            context = thisContext;
            map = thisMap;

            //Set initial value of map extent, in the state manager
            context.sandbox.stateManager.setMapExtent({
                extent: {
                    minLon: context.sandbox.mapConfiguration.initialMinLon,
                    minLat: context.sandbox.mapConfiguration.initialMinLat,
                    maxLon: context.sandbox.mapConfiguration.initialMaxLon,
                    maxLat: context.sandbox.mapConfiguration.initialMaxLat
                }
            });

            //Listen for map movents and update the map extent in the state manager
            map.on('moveend', function(evt) {
                var currentExtent = map.getBounds();
                context.sandbox.stateManager.setMapExtent({
                    extent: {
                        minLon: currentExtent.getWest(),
                        minLat: currentExtent.getSouth(),
                        maxLon: currentExtent.getEast(),
                        maxLat: currentExtent.getNorth()
                    }
                });
            });

            //Check if there is a user setting; If no user setting, use default true.
            cursorLocation = context.sandbox.cursorLocation;
            if(!cursorLocation
                || !('defaultDisplay' in cursorLocation)
                || cursorLocation.defaultDisplay){
                map.on('mousemove', function(e) {
                    var position = e.latlng;
                    publisher.publishMousePosition({
                        lat: position.lat,
                        lon: position.lng
                    });
                });
            }

            exposed.zoomToExtent({
                map: map,
                minLon: context.sandbox.mapConfiguration.initialMinLon,
                minLat: context.sandbox.mapConfiguration.initialMinLat,
                maxLon: context.sandbox.mapConfiguration.initialMaxLon,
                maxLat: context.sandbox.mapConfiguration.initialMaxLat
            });
        },
        zoomIn: function(params) {
            map.zoomIn();
        },
        zoomOut: function(params) {
            map.zoomOut();
        },
        /**
         * Zoom to bbox
         * @param params
         */
        zoomToExtent: function(params) {
            var southWest = L.latLng(params.minLat, params.minLon),
                northEast = L.latLng(params.maxLat, params.maxLon),
                bounds = L.latLngBounds(southWest, northEast);
            map.fitBounds(bounds);
        },
        /**
         * Zoom to extent of layer DATA
         * @param params
         */
        zoomToLayer: function(params) {
            var layer = mapLayers.getActiveLayer();

            if(layer && layer.getBounds(params.layerId)) {
                map.fitBounds(layer.getBounds(params.layerId));
            }
        },
        /**
         * Zoom to features (all features in array must belong to the same layer)
         * @param params
         */
        zoomToFeatures: function(params) {
            var layer = mapLayers.getActiveLayer(),
                features = layer.getFeatures(params.layerId),
                bounds = new L.LatLngBounds();

            context.sandbox.utils.each(features, function(index, obj){
                if(obj.feature.geometry.type === 'Point'){
                    bounds.extend(obj.getLatLng());
                }
            });
           
            if(features.length === '0'){
                publisher.publishMessage({
                    messageType: 'warning',
                    messageTitle: 'Zoom to Features',
                    messageText: 'Features not found.'
                });
            }else{
                //this goes to max zoom. If expecting different behavior, 
                //use setZoom to change the zoom.
                map.fitBounds(bounds);
            }
        },
        /**
         * Pan to given point and zoom to zoom-level-8
         * @param params
         */
        setCenter: function(params) {
            var centerPoint,
                lat = params.lat,
                lon = params.lon,
                layer = mapLayers.getActiveLayer();

            centerPoint = new L.latLng(lat, lon);
            map.setView(centerPoint, 8);

        }
    };
    
    return exposed;
});