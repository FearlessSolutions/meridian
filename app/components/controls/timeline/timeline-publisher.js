define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        hideLayer: function(args) {
            context.sandbox.emit('map.layer.hide', args); 
        },
        showLayer: function(args) {
            context.sandbox.emit('map.layer.show', args); 
        },
        hideAllLayers: function() {
            context.sandbox.emit('map.layer.hide.all');   
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