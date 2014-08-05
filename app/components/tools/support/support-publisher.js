define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishOpening: function(params){
            context.sandbox.emit('menu.opening', params);
        }
    };

    return exposed;
});