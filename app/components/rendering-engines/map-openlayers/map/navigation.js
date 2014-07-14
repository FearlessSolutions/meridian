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
        zoomToExtent: function(params) {
            var bounds = new OpenLayers.Bounds(params.minLon, params.minLat, params.maxLon, params.maxLat);
            params.map.zoomToExtent(bounds.transform(params.map.projectionWGS84, params.map.projection), true);
        },
        zoomToLayer: function(params) {
            var queryLayer = params.map.getLayersBy('layerId', params.layerId)[0];

            if(queryLayer){
                params.map.zoomToExtent(queryLayer.getDataExtent());
            }
        },
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