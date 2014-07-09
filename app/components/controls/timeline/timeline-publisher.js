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
        setLayerIndex: function(params) {
            context.sandbox.emit('map.layer.index.set', params);
        },
        plotFeatures: function(params) {
            context.sandbox.emit('map.features.plot', params);
        },
        hideLayer: function(params) {
            context.sandbox.emit('map.layer.hide', params); 
        },
        showLayer: function(params) {
            context.sandbox.emit('map.layer.show', params); 
        },
        stopPlayback: function(params){
            context.sandbox.emit('timeline.playback.stop', params);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        },
    };

    return exposed;

});