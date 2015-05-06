define([
	'./visual-mode-toggle'
], function (visualModeToggle) {

    var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('notification.confirm', visualModeToggle.setFeatureMode);
            context.sandbox.on('data.clear.all', visualModeToggle.clear);
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