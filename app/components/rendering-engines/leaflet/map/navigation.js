define([
    './../map-api-publisher',
    './layers',
    './../libs/leaflet-src'
], function(publisher, mapLayers) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        zoomIn: function(params) {
            params.map.zoomIn();
        },
        zoomOut: function(params) {
            params.map.zoomOut();
        },
        /**
         * Zoom to bbox
         * @param params
         */
        zoomToExtent: function(params) {
            var southWest = L.latLng(params.minLat, params.minLon),
                northEast = L.latLng(params.maxLat, params.maxLon),
                bounds = L.latLngBounds(southWest, northEast);
            params.map.fitBounds(bounds);
        },
        /**
         * Zoom to extent of layer DATA
         * @param params
         */
        zoomToLayer: function(params) {

            var layer = mapLayers.getActiveLayer();

            if(layer && layer.getBounds(params.layerId)) {
                params.map.fitBounds(layer.getBounds(params.layerId));
            }
        },
        /**
         * Zoom to features (all features in array must belong to the same layer)
         * @param params
         */
        zoomToFeatures: function(params) {
            var layer = mapLayers.getActiveLayer();

            var features = layer.getFeatures(params.layerId);

            var bounds = new L.LatLngBounds();

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
                params.map.fitBounds(bounds);
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
            params.map.setView(centerPoint, 8);
        }
    };
    
    return exposed;
});