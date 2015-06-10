define([
    './aoi'
], function (aoi) {
    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.layer.create', aoi.createAOI);
            context.sandbox.on('map.layer.hide', aoi.hideAOILayer);
            context.sandbox.on('map.layer.show', aoi.showAOILayer);
            context.sandbox.on('map.layer.delete', aoi.deleteAOILayer);
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
        hideAOILayer: function(params) {
            context.sandbox.emit('map.layer.hide', params);
        },
        showAOILayer: function(params) {
            context.sandbox.emit('map.layer.show', params);
        },
        deleteAOILayer: function(params) {
            context.sandbox.emit('map.layer.delete', params);
        }
        };


    return exposed;
});