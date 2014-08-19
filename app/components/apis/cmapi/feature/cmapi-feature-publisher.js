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
        },
        publishHideFeatures: function(args) {
            context.sandbox.emit('map.features.hide', args);
        },
        publishShowFeatures: function(args) {
            context.sandbox.emit('map.features.show', args);
        },
        publishZoomToFeatures: function(args) {
            context.sandbox.emit('map.zoom.toFeatures', args);
        }
    };

    return exposed;
});