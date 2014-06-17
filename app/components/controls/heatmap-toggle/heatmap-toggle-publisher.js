define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        heatmapOn: function() {
            context.sandbox.emit('map.heat.on');
        },
        heatmapOff: function() {
            context.sandbox.emit('map.heat.off');
        },
        publishOpening: function(args){
            context.sandbox.emit('menu.opening', args);
        },
        configHeatmapLayers: function(args) {
            context.sandbox.emit('map.heat.configLayers', args);  
        }
    };

    return exposed;

});