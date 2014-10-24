define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        changeBasemap: function(params) {
            context.sandbox.emit('map.basemap.change', params);
        },
        openBasemapGallery: function() {
            context.sandbox.emit('basemapGallery.open');
        },
        closeBasemapGAllery: function() {
            context.sandbox.emit('basemapGallery.close');
        }
    };

    return exposed;

});