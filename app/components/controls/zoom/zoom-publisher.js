define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        zoomIn: function() {
            context.sandbox.emit('map.zoom.in');
        },
        zoomOut: function() {
            context.sandbox.emit('map.zoom.out');
        }
    };

    return exposed;

});