define([
], function () {

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        startPlayback: function(args){
            context.sandbox.emit('timeline.playback.start', args);
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