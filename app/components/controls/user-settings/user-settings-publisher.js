define([
], function () {

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params);
        },
        publishOpening: function(params){
            context.sandbox.emit('menu.opening', params);
        },
        zoomToLocation: function(params){
            context.sandbox.emit('map.zoom.toLocation',params);
        },
        changeBasemap: function(params) {
            context.sandbox.emit('map.basemap.change', params);
        }
    };

    return exposed;

});