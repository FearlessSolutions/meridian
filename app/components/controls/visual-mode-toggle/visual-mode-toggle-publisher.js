define([
], function () {

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        setVisualMode: function(params) {
            context.sandbox.emit('map.visualMode.set', params);
        },
        publishNotification: function(params) {
            context.sandbox.emit('notification.open', params);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params);
        }
    };

    return exposed;

});