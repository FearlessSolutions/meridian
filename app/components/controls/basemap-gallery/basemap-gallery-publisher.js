define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        changeBasemap: function(args) {
            context.sandbox.emit('map.basemap.change', args);
        }
    };

    return exposed;

});