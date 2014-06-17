define([
	'./map-openlayers'
], function (olMapRenderer) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            if(context.sandbox.mapConfiguration.defaultMapEngine === 'OpenLayers') {
                exposed.subscribeOn();
            }
            context.sandbox.on('map.start', exposed.startMap);

            //This will be used when map switcher is introduced
            context.sandbox.on('map.stop', exposed.stopMap); 
        },
        startMap: function(args){
            if(args.map === 'OpenLayers') {
                olMapRenderer.createMap();
                exposed.subscribeOn();
            }
        },
        stopMap: function(args){
            if(args.map === 'OpenLayers') {
                //olMapRenderer.destroyMap();
                //exposed.subscribeOff();
            }
        },
        subscribeOn: function(){
            context.sandbox.on('data.add', olMapRenderer.plotFeatures);
            context.sandbox.on('point.plot', olMapRenderer.plotPoint);
            context.sandbox.on('map.basemap.change', olMapRenderer.setBasemap);
            context.sandbox.on('map.center.set', olMapRenderer.setCenter);
            context.sandbox.on('map.draw.bbox.remove', olMapRenderer.removeBBox);
            context.sandbox.on('map.draw.bbox.start', olMapRenderer.drawBBox);
            context.sandbox.on('map.get.extent', olMapRenderer.getExtent);
            context.sandbox.on('map.layer.create', olMapRenderer.createLayer);
            context.sandbox.on('map.layer.create', olMapRenderer.createShapeLayer);
            context.sandbox.on('map.layer.hide', olMapRenderer.hideLayer);
            context.sandbox.on('map.layer.hide.all', olMapRenderer.hideAllLayers);
            context.sandbox.on('map.layer.show', olMapRenderer.showLayer);
            context.sandbox.on('map.layer.toggle', olMapRenderer.toggleLayer);
            context.sandbox.on('map.visualMode', olMapRenderer.changeVisualMode);
            context.sandbox.on('map.zoom.in', olMapRenderer.zoomIn);
            context.sandbox.on('map.zoom.out', olMapRenderer.zoomOut);
            context.sandbox.on('map.zoom.location', olMapRenderer.zoomToLocation);
            context.sandbox.on('map.zoom.layer', olMapRenderer.zoomToLayer);
            context.sandbox.on('data.record.identify', olMapRenderer.identifyRecord);
            context.sandbox.on('system.clear', olMapRenderer.clear);
        },
        subscribeOff: function(){
            context.sandbox.off('data.add', olMapRenderer.plotFeatures);
            context.sandbox.off('point.plot', olMapRenderer.plotPoint);
            context.sandbox.off('map.basemap.change', olMapRenderer.setBasemap);
            context.sandbox.off('map.center.set', olMapRenderer.setCenter);
            context.sandbox.off('map.draw.bbox.remove', olMapRenderer.removeBBox);
            context.sandbox.off('map.draw.bbox.start', olMapRenderer.drawBBox);
            context.sandbox.off('map.get.extent', olMapRenderer.getExtent);
            context.sandbox.off('map.layer.create', olMapRenderer.createLayer);
            context.sandbox.off('map.layer.create', olMapRenderer.createShapeLayer);
            context.sandbox.off('map.layer.hide', olMapRenderer.hideLayer);
            context.sandbox.off('map.layer.hide.all', olMapRenderer.hideAllLayers);
            context.sandbox.off('map.layer.show', olMapRenderer.showLayer);
            context.sandbox.off('map.layer.toggle', olMapRenderer.toggleLayer);
            context.sandbox.off('map.visualMode', olMapRenderer.changeVisualMode);
            context.sandbox.off('map.zoom.in', olMapRenderer.zoomIn);
            context.sandbox.off('map.zoom.out', olMapRenderer.zoomOut);
            context.sandbox.off('map.zoom.location', olMapRenderer.zoomToLocation);
            context.sandbox.off('map.zoom.layer', olMapRenderer.zoomToLayer);
            context.sandbox.off('data.record.identify', olMapRenderer.identifyRecord);
            context.sandbox.off('system.clear', olMapRenderer.clear);
        }
    };	

    return exposed;
});