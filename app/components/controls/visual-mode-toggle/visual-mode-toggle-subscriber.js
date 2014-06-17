define([
	'./visual-mode-toggle'
], function (visualModeToggle) {

    var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('notification.confirm', visualModeToggle.setFeatureMode);
            context.sandbox.on('system.clear', visualModeToggle.clear);
        }
    };

    return exposed;

});