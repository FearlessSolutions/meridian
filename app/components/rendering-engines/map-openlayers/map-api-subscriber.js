define([
	'./map/core'
], function (mapCore) {
    var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;

            exposed.subscribeOn();
        },
        subscribeOn: function() {
            context.sandbox.on('map.features.plot', mapCore.plotFeatures);
            context.sandbox.on('map.features.show', mapCore.showFeatures);
            context.sandbox.on('map.features.hide', mapCore.hideFeatures);
            context.sandbox.on('map.features.update', mapCore.updateFeatures);
            context.sandbox.on('map.feature.identify', mapCore.identifyRecord);
            context.sandbox.on('map.basemap.change', mapCore.setBasemap);
            context.sandbox.on('map.center.set', mapCore.setCenter);
            context.sandbox.on('map.draw.clear', mapCore.clearDrawing);
            context.sandbox.on('map.draw.start', mapCore.startDrawing);
            context.sandbox.on('map.layer.create', mapCore.createLayer);
            context.sandbox.on('map.layer.delete', mapCore.deleteLayer);
            context.sandbox.on('map.layer.index.set', mapCore.setLayerIndex);
            context.sandbox.on('map.layer.hide', mapCore.hideLayer);
            context.sandbox.on('map.layer.show', mapCore.showLayer);
            context.sandbox.on('map.visualMode.set', mapCore.changeVisualMode);
            context.sandbox.on('map.zoom.in', mapCore.zoomIn);
            context.sandbox.on('map.zoom.out', mapCore.zoomOut);
            context.sandbox.on('map.zoom.maxExtent', mapCore.zoomToMaxExtent);
            context.sandbox.on('map.zoom.toLocation', mapCore.zoomToExtent);
            context.sandbox.on('map.zoom.toFeatures', mapCore.zoomToFeatures);
            context.sandbox.on('map.view.center.feature', mapCore.zoomToFeatures);
            context.sandbox.on('map.zoom.toLayer', mapCore.zoomToLayer);
            context.sandbox.on('data.clear.all', mapCore.clear);
        },
        subscribeOff: function() {
            context.sandbox.off('map.features.plot', mapCore.plotFeatures);
            context.sandbox.off('map.features.show', mapCore.showFeatures);
            context.sandbox.off('map.features.hide', mapCore.hideFeatures);
            context.sandbox.off('map.features.update', mapCore.updateFeatures);
            context.sandbox.off('map.feature.identify', mapCore.identifyRecord);
            context.sandbox.off('map.basemap.change', mapCore.setBasemap);
            context.sandbox.off('map.center.set', mapCore.setCenter);
            context.sandbox.off('map.draw.clear', mapCore.clearDrawing);
            context.sandbox.off('map.draw.start', mapCore.startDrawing);
            context.sandbox.off('map.layer.create', mapCore.createLayer);
            context.sandbox.off('map.layer.delete', mapCore.deleteLayer);
            context.sandbox.off('map.layer.index.set', mapCore.setLayerIndex);
            context.sandbox.off('map.layer.hide', mapCore.hideLayer);
            context.sandbox.off('map.layer.show', mapCore.showLayer);
            context.sandbox.off('map.visualMode.set', mapCore.changeVisualMode);
            context.sandbox.off('map.zoom.in', mapCore.zoomIn);
            context.sandbox.off('map.zoom.out', mapCore.zoomOut);
            context.sandbox.off('map.zoom.maxExtent', mapCore.zoomToMaxExtent);
            context.sandbox.off('map.zoom.toLocation', mapCore.zoomToLocation);
            context.sandbox.off('map.zoom.toFeatures', mapCore.zoomToFeatures);
            context.sandbox.off('map.view.center.feature', mapCore.zoomToFeatures);
            context.sandbox.off('map.zoom.toLayer', mapCore.zoomToLayer);
            context.sandbox.off('data.clear.all', mapCore.clear);
        }
    };	

    return exposed;
});