define([
	'./locator'
], function (component) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('data.clear.all', component.clear);
        },
        markLocation: function(params){
            context.sandbox.emit('map.features.plot', params); 
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        },
        setMapCenter: function(params) {
            context.sandbox.emit('map.center.set', params);
        },
        zoomToFeature: function(params){
            context.sandbox.emit('map.zoom.toFeatures',params);
        },
        zoomToLocation: function(params){
            context.sandbox.emit('map.zoom.toLocation',params);
        }
    };	

    return exposed;
});