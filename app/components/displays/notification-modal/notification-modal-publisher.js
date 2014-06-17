define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishConfirmation: function(args) {
            context.sandbox.emit('notification.confirm', args); 
        }
    };

    return exposed;

});