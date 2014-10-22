define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
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