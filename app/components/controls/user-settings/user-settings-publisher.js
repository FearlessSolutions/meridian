define([
], function () {

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishMessage: function(args) {
            context.sandbox.emit('message.publish', args);
        },
        publishOpening: function(args){
            context.sandbox.emit('menu.opening', args);
        },
        zoomToLocation: function(args){
            context.sandbox.emit('map.zoom.location',args);
        },
        changeBasemap: function(args) {
            context.sandbox.emit('map.basemap.change', args);
        },
        getExtent: function(args) {
            context.sandbox.emit('map.get.extent',args);
        }
    };

    return exposed;

});