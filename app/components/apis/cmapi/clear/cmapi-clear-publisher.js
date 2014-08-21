define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishClear: function(args) {
            context.sandbox.emit('data.clear.all', args);
        }
    };

    return exposed;
});