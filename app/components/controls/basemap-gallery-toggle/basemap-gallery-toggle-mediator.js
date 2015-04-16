define([
    './basemap-gallery-toggle'
], function (basemapGallery) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('basemapGallery.close', basemapGallery.removeActive);
            context.sandbox.on('basemapGallery.open', basemapGallery.setActive);
            context.sandbox.on('data.clear.all', basemapGallery.clear);
        },
        closeBasemapGallery: function(params) {
            context.sandbox.emit('basemapGallery.close');
        },
        openBasemapGallery: function(params) {
            context.sandbox.emit('basemapGallery.open');
        }
    };	

    return exposed;
});