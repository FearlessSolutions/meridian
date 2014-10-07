define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
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