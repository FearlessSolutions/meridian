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
            context.sandbox.on('data.add', mapCore.plotFeatures);
            context.sandbox.on('point.plot', mapCore.plotPoint);
            context.sandbox.on('map.basemap.change', mapCore.setBasemap);
            context.sandbox.on('map.center.set', mapCore.setCenter);
            context.sandbox.on('map.draw.bbox.remove', mapCore.removeBBox);
            context.sandbox.on('map.draw.bbox.start', mapCore.drawBBox);
            context.sandbox.on('map.get.extent', mapCore.broadcastMapExtent);
            context.sandbox.on('map.layer.create', mapCore.createLayer);
            // context.sandbox.on('map.layer.create', mapCore.createShapeLayer);
            context.sandbox.on('map.layer.hide', mapCore.hideLayer);
            context.sandbox.on('map.layer.hide.all', mapCore.hideAllLayers);
            context.sandbox.on('map.layer.show', mapCore.showLayer);
            context.sandbox.on('map.layer.toggle', mapCore.toggleLayer);
            context.sandbox.on('map.visualMode', mapCore.changeVisualMode);
            context.sandbox.on('map.zoom.in', mapCore.zoomIn);
            context.sandbox.on('map.zoom.out', mapCore.zoomOut);
            context.sandbox.on('map.zoom.location', mapCore.zoomToExtent);
            context.sandbox.on('map.zoom.layer', mapCore.zoomToLayer);
            // context.sandbox.on('data.record.identify', mapCore.identifyRecord);
            // context.sandbox.on('system.clear', mapCore.clear);
        },
        subscribeOff: function(){
            context.sandbox.off('data.add', mapCore.plotFeatures);
            context.sandbox.off('point.plot', mapCore.plotPoint);
            context.sandbox.off('map.basemap.change', mapCore.setBasemap);
            context.sandbox.off('map.center.set', mapCore.setCenter);
            context.sandbox.off('map.draw.bbox.remove', mapCore.removeBBox);
            context.sandbox.off('map.draw.bbox.start', mapCore.drawBBox);
            context.sandbox.off('map.get.extent', mapCore.getExtent);
            context.sandbox.off('map.layer.create', mapCore.createLayer);
            context.sandbox.off('map.layer.create', mapCore.createShapeLayer);
            context.sandbox.off('map.layer.hide', mapCore.hideLayer);
            context.sandbox.off('map.layer.hide.all', mapCore.hideAllLayers);
            context.sandbox.off('map.layer.show', mapCore.showLayer);
            context.sandbox.off('map.layer.toggle', mapCore.toggleLayer);
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