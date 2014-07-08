define([
    './timeline'
], function (timeline) {
    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.layer.create', timeline.createSnapshot);
            context.sandbox.on('map.layer.hide.all', timeline.allSnapshotsOff);
            context.sandbox.on('map.heat.on', timeline.hideTimeline);
            context.sandbox.on('map.heat.off', timeline.showTimeline);
            context.sandbox.on('system.clear', timeline.clear);
            context.sandbox.on('data.add', timeline.addCount);
            context.sandbox.on('data.finished', timeline.markFinished);  
            context.sandbox.on('data.error', timeline.markError);
            context.sandbox.on('timeline.playback.start', timeline.timelinePlaybackStart);
            context.sandbox.on('timeline.playback.stop', timeline.timelinePlaybackStop);
            context.sandbox.on('timeline.menu.layer.hide', timeline.hideLayer);
            context.sandbox.on('timeline.menu.layer.show', timeline.showLayer);
        }
    };

    return exposed;
});