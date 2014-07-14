define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishPlotFeature: function(message){
          context.sandbox.emit('map.features.plot', message);
        },
        publishPlotFinish: function(params) {
            context.sandbox.emit('data.finished', params);
        },
        publishPlotError: function(params) {
            context.sandbox.emit('data.error', params);
        },
        publishPlotUrl: function(message){
            //TODO don't support?
        },
        publishUnplotFeature: function(message){
            //TODO no remove feature yet
        },
        publishHideFeature: function(message){
            //TODO no hide single feature yet
        },
        publishShowFeature: function(message){
            //TODO no show single feature yet
        },
        publishSelectedFeature: function(message){
            //TODO no selection yet
        },
        publishDeselectedFeature: function(message){
            //TODO no deselection yet
        },
        publishUpdateFeature: function(message){
            //TODO don't support?
        },
        publishCreateLayer: function(args) {
            context.sandbox.emit('map.layer.create', args);
        }
    };

    return exposed;
});