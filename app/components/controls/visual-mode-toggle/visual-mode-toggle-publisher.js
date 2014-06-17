define([
], function () {

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        setVisualMode: function(args) {
            context.sandbox.emit('map.visualMode', args);
        },
        publishNotification: function(args) {
            context.sandbox.emit('notification.open', args);
        },
        publishMessage: function(args) {
            context.sandbox.emit('message.publish', args);
        }
    };

    return exposed;

});