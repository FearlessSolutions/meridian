define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        markLocation: function(args){
            context.sandbox.emit('map.features.plot', args); 
        },
        publishMessage: function(args) {
            context.sandbox.emit('message.publish', args); 
        },
        setMapCenter: function(args) {
            context.sandbox.emit('map.center.set', args);
        },
        zoomToLocation: function(args){
            context.sandbox.emit('map.zoom.location',args);
        }
    };

    return exposed;

});