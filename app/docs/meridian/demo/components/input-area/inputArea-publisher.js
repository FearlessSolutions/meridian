define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishInput: function(params){
            context.sandbox.emit('show.text', params); 
        }
    };

    return exposed;
});