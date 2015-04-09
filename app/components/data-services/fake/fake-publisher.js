define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        createLayer: function(params) {
            context.sandbox.emit('map.layer.create', params);
        },
        createLayerAOI: function(params) {
            context.sandbox.emit('map.layer.create.aoi', params);
        },
        plotFeatures: function(params) {
            context.sandbox.emit('map.features.plot', params);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        },
        publishFinish: function(params) {
            context.sandbox.emit('data.finished', params);
        },
        publishError: function(params) {
            context.sandbox.emit('data.error', params);
        },
        addToProgressQueue: function() {
            context.sandbox.emit('progress.queue.add');
        },
        removeFromProgressQueue: function() {
            context.sandbox.emit('progress.queue.remove');
        }
    };

    return exposed;
});