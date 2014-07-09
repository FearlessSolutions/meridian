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
        setLayerIndex: function(args) {
            context.sandbox.emit('map.layer.index.set', args);
        },
        plotFeatures: function(args) {
            context.sandbox.emit('map.features.plot', args);
        },
        hideLayer: function(args) {
            context.sandbox.emit('map.layer.hide', args); 
        },
        showLayer: function(args) {
            context.sandbox.emit('map.layer.show', args); 
        },
        stopPlayback: function(args){
            context.sandbox.emit('timeline.playback.stop', args);
        },
        publishMessage: function(args) {
            context.sandbox.emit('message.publish', args); 
        },
    };

    return exposed;

});