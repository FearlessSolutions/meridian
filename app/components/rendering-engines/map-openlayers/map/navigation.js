define([
    './../map-api-publisher',
    './../libs/openlayers-2.13.1/OpenLayers'
], function(publisher) {
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
            var bounds = new OpenLayers.Bounds(params.minLon, params.minLat, params.maxLon, params.maxLat);
            params.map.zoomToExtent(bounds.transform(params.map.projectionWGS84, params.map.projection), true);
        },
        /**
         * Zoom to extent of layer DATA
         * @param params
         */
        zoomToLayer: function(params) {
            var layer = params.map.getLayersBy('layerId', params.layerId)[0];

            if(layer && layer.getDataExtent()) {
                params.map.zoomToExtent(layer.getDataExtent());
            } else {
                publisher.publishMessage({
                    messageType: 'warning',
                    messageTitle: 'Zoom to Layer',
                    messageText: 'No data in layer to zoom to.'
                });
            }
        },
        /**
         * Zoom to features (all features in array must belong to the same layer)
         * @param params
         */
        zoomToFeatures: function(params) {
            var layer = params.map.getLayersBy('layerId', params.layerId)[0];
            var bounds = new OpenLayers.Bounds();
            
            // TODO: make it also work in cluster mode (to check through the features in clusters)
            context.sandbox.utils.each(params.featureIds, function(key, value) {
                var feature = layer.getFeatureBy('featureId', value);
                var featureExtent = feature.geometry.getBounds();
                bounds.extend(featureExtent);
            });

            if(layer && bounds) {
                params.map.zoomToExtent(bounds);
            } else {
                publisher.publishMessage({
                    messageType: 'warning',
                    messageTitle: 'Zoom to Features',
                    messageText: 'Features not found.'
                });
            }
        },
        /**
         * Pan to given point and zoom to zoom-level-8
         * @param params
         */
        setCenter: function(params) {
            var centerPoint,
                lat = params.lat,
                lon = params.lon;

            centerPoint = new OpenLayers.LonLat(lat, lon);
            params.map.setCenter(centerPoint.transform(params.map.projectionWGS84, params.map.projection), 8);
        }
    };
    
    return exposed;
});