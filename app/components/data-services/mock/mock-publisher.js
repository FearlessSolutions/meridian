define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        createLayer: function(args) {
            context.sandbox.emit('map.layer.create', args);
        },
        plotFeatures: function(args) {
            context.sandbox.emit('map.features.plot', args);
        },
        publishData: function(args) {
            context.sandbox.emit('data.add', args);
        },
        publishMessage: function(args) {
            context.sandbox.emit('message.publish', args); 
        },
        publishFinish: function(args) {
            context.sandbox.emit('data.finished', args);
        },
        publishError: function(args){
            context.sandbox.emit('data.error', args);
        }
    };

    return exposed;
});