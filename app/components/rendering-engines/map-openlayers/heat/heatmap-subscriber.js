define([
	'jquery',
    './heatmap',	
], function ($, heatmap) {

    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            if(context.sandbox.mapConfiguration.defaultMapEngine === 'OpenLayers') {
                exposed.subscribeOn();
            }
        },
        subscribeOn: function(){
            // context.sandbox.on('map.heat.on', heatmap.turnOn);
            // context.sandbox.on('map.heat.off', heatmap.turnOff);
            context.sandbox.on('system.clear', heatmap.clear);
            // context.sandbox.on('map.heat.configLayers', heatmap.configHeatmapLayers);
            context.sandbox.on('data.add', heatmap.update);
            context.sandbox.on('map.visualMode', heatmap.update);
            context.sandbox.on('map.layer.show', heatmap.update); 
            context.sandbox.on('map.layer.hide', heatmap.update); 
        }
    };	

    return exposed;

});