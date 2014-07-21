define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        getStatus: function(message) {
          context.sandbox.emit('map.get.status');   
        }
    };

    return exposed;
});