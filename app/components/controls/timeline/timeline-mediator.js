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
            context.sandbox.on('data.finished', timeline.validateBookmark);
            context.sandbox.on('query.stop', timeline.markStopped);
            context.sandbox.on('data.error', timeline.markError);
            context.sandbox.on('timeline.playback.start', timeline.timelinePlaybackStart);
            context.sandbox.on('timeline.playback.stop', timeline.timelinePlaybackStop);
            context.sandbox.on('timeline.open', timeline.showTimeline);
            context.sandbox.on('timeline.close', timeline.hideTimeline);
        },
        closeTimeline: function(params) {
            context.sandbox.emit('timeline.close');
        },
        openTimeline: function(params) {
            context.sandbox.emit('timeline.open');
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
        deleteLayer: function(params) {
            context.sandbox.emit('map.layer.delete', params);
        },
        stopPlayback: function(params) {
            context.sandbox.emit('timeline.playback.stop', params);
        },
        stopQuery: function(params) {
            context.sandbox.emit('query.stop', params);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        }
    };

    return exposed;
});