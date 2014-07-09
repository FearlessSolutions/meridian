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
        plotFeatures: function(params) {
            context.sandbox.emit('map.features.plot', params);
        },
        publishData: function(params) {
            context.sandbox.emit('data.add', params);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        },
        publishFinish: function(params) {
            context.sandbox.emit('data.finished', params);
        },
        publishError: function(params){
            context.sandbox.emit('data.error', params);
        }
    };

    return exposed;
});