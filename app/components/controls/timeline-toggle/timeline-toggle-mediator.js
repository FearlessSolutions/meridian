define([
    './timeline-toggle'
], function (timelineToggle) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('timeline.close', timelineToggle.removeActive);
            context.sandbox.on('timeline.open', timelineToggle.setActive);
            context.sandbox.on('data.clear.all', timelineToggle.clear);
        },
        closeTimeline: function(params) {
            context.sandbox.emit('timeline.close');
        },
        openTimeline: function(params) {
            context.sandbox.emit('timeline.open');
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params);
        }
    };	

    return exposed;
});