define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        createLayer: function(args){
            context.sandbox.emit('map.layer.create', args);  
        },
        plotFeatures: function(args){
            context.sandbox.emit('map.features.plot', args);  
        },
        zoomToFeatures: function(args){
            context.sandbox.emit('map.zoom.toLayer', args);  
        }
    };

    return exposed;
});