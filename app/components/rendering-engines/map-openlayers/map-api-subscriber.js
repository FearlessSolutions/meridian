define([
	'./map/core'
], function (mapCore) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;

            exposed.subscribeOn();
        },
        subscribeOn: function(){
            context.sandbox.on('map.features.plot', mapCore.plotFeatures);
            context.sandbox.on('data.add', mapCore.plotFeatures); // ?
            context.sandbox.on('map.basemap.change', mapCore.setBasemap);
            context.sandbox.on('map.center.set', mapCore.setCenter);
            context.sandbox.on('map.draw.clear', mapCore.clearDrawing);
            context.sandbox.on('map.draw.start', mapCore.startDrawing);
            context.sandbox.on('map.layer.create', mapCore.createLayer);
            context.sandbox.on('map.layer.index.set', mapCore.setLayerIndex);
            context.sandbox.on('map.layer.hide', mapCore.hideLayer);
            context.sandbox.on('map.layer.show', mapCore.showLayer);
            context.sandbox.on('map.visualMode', mapCore.changeVisualMode); // map.visualMode.set
            context.sandbox.on('map.zoom.in', mapCore.zoomIn);
            context.sandbox.on('map.zoom.out', mapCore.zoomOut);
            context.sandbox.on('map.zoom.location', mapCore.zoomToExtent); // map.zoom.toLocation
            context.sandbox.on('map.zoom.layer', mapCore.zoomToLayer); // map.zoom.toLayer
            context.sandbox.on('data.record.identify', mapCore.identifyRecord); // map.feature.identify
            context.sandbox.on('system.clear', mapCore.clear); // data.clear.all
        },
        subscribeOff: function(){
            context.sandbox.off('map.features.plot', mapCore.plotFeatures);
            context.sandbox.off('data.add', mapCore.plotFeatures);
            context.sandbox.off('map.basemap.change', mapCore.setBasemap);
            context.sandbox.off('map.center.set', mapCore.setCenter);
            context.sandbox.off('map.draw.clear', mapCore.clearDrawing);
            context.sandbox.off('map.draw.start', mapCore.startDrawing);
            context.sandbox.off('map.layer.create', mapCore.createLayer);
            context.sandbox.off('map.layer.index.set', mapCore.setLayerIndex);
            context.sandbox.off('map.layer.hide', mapCore.hideLayer);
            context.sandbox.off('map.layer.show', mapCore.showLayer);
            context.sandbox.off('map.visualMode', mapCore.changeVisualMode);
            context.sandbox.off('map.zoom.in', mapCore.zoomIn);
            context.sandbox.off('map.zoom.out', mapCore.zoomOut);
            context.sandbox.off('map.zoom.location', mapCore.zoomToLocation);
            context.sandbox.off('map.zoom.layer', mapCore.zoomToLayer);
            context.sandbox.off('data.record.identify', mapCore.identifyRecord);
            context.sandbox.off('system.clear', mapCore.clear);
        }
    };	

    return exposed;
});