define([
    './../libs/openlayers-2.13.1/OpenLayers'
], function(){
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
            var queryLayer = params.map.getLayersBy('layerId', params.layerId)[0];

            if(queryLayer){
                params.map.zoomToExtent(queryLayer.getDataExtent());
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