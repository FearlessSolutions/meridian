define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishOpening: function(args){
            context.sandbox.emit('menu.opening', args);
        }
    };

    return exposed;
});