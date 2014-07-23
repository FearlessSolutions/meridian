define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
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
        zoomToLocation: function(params){
            context.sandbox.emit('map.zoom.toLocation',params);
        }
    };

    return exposed;

});