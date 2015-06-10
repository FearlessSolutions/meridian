define([
    './aoi'
], function (aoi) {
    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.layer.create', aoi.createAOI);
            //context.sandbox.on('map.layer.hide', aoi.hideLayer);
            //context.sandbox.on('map.layer.show', aoi.showLayer);
            //context.sandbox.on('map.layer.delete', aoi.deleteLayer);
            context.sandbox.on('map.features.plot', aoi.updateAOI);
        },
            createLayer: function(params){
                context.sandbox.emit('map.layer.create', params);
            },
            setLayerIndex: function(params){
                context.sandbox.emit('map.layer.index.set', params);
            },
            plotFeatures: function(params){
                context.sandbox.emit('map.features.plot', params);
            },
        hideLayer: function(params) {
            context.sandbox.emit('map.layer.hide', params);
        },
        showLayer: function(params) {
            context.sandbox.emit('map.layer.show', params);
        },
        deleteLayer: function(params) {
            context.sandbox.emit('map.layer.delete', params);
        }
        };


    return exposed;
});