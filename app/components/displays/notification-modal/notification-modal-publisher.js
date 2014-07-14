define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishConfirmation: function(params) {
            context.sandbox.emit('notification.confirm', params); 
        }
    };

    return exposed;

});