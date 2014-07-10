define([
], function () {

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        startPlayback: function(params){
            context.sandbox.emit('timeline.playback.start', params);
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