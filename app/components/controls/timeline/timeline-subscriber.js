define([
    './timeline'
], function (timeline) {
    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.layer.create', timeline.createSnapshot);
            context.sandbox.on('map.layer.hide', timeline.hideLayer);
            context.sandbox.on('map.layer.show', timeline.showLayer);
            context.sandbox.on('map.layer.delete', timeline.deleteLayer);
            context.sandbox.on('map.heat.on', timeline.hideTimeline);
            context.sandbox.on('map.heat.off', timeline.showTimeline);    
            context.sandbox.on('data.clear.all', timeline.clear);
            context.sandbox.on('map.features.plot', timeline.updateCount);
            context.sandbox.on('data.finished', timeline.markFinished);  
            context.sandbox.on('query.stop', timeline.markStopped);
            context.sandbox.on('data.error', timeline.markError);
            context.sandbox.on('bookmark.create', timeline.timelineBookmarkCreate);
            context.sandbox.on('timeline.playback.start', timeline.timelinePlaybackStart);
            context.sandbox.on('timeline.playback.stop', timeline.timelinePlaybackStop);
            context.sandbox.on('timeline.menu.layer.hide', timeline.hideSnapshotLayerGroup);
            context.sandbox.on('timeline.menu.layer.show', timeline.showSnapshotLayerGroup);
            context.sandbox.on('timeline.menu.layer.delete', timeline.deleteSnapshotLayerGroup);
            context.sandbox.on('timeline.open', timeline.showTimeline);
            context.sandbox.on('timeline.close', timeline.hideTimeline);
        }
    };

    return exposed;
});