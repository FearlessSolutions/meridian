define([
    './basemap-gallery'
], function (basemapGallery) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('basemapGallery.close', basemapGallery.hide);
            context.sandbox.on('basemapGallery.open', basemapGallery.show);
            context.sandbox.on('map.basemap.change', basemapGallery.changeBasemap);
        }
    };	

    return exposed;
});