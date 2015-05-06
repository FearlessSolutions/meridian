define([
], function () {
	var context;

	return {
        init: function(thisContext) {
            context = thisContext;
        },
        changeBasemap: function(params) {
            context.sandbox.emit('map.basemap.change', params);
        }
    };

});