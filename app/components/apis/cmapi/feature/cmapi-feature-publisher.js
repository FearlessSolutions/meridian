define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishPlotFeature: function(message) {
          context.sandbox.emit('map.features.plot', message);
        },
        publishPlotFinish: function(params) {
            context.sandbox.emit('data.finished', params);
        },
        publishPlotError: function(params) {
            context.sandbox.emit('data.error', params);
        },
        publishCreateLayer: function(args) {
            context.sandbox.emit('map.layer.create', args);
        }
    };

    return exposed;
});