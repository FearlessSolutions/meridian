define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        changeBasemap: function(params) {
            context.sandbox.emit('map.basemap.change', params);
        }
    };

    return exposed;

});