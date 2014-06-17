define([
    './playback'
], function (playback) {
    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('timeline.playback.start', playback.startPlayback);
            context.sandbox.on('timeline.playback.stop', playback.stopPlayback);
        }
    };

    return exposed;
});