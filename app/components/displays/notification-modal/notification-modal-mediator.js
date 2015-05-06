define([
	'./notification-modal'
], function (notificationModal) {

    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('notification.open', notificationModal.open);
            context.sandbox.on('data.clear.all', notificationModal.clear);
        },
        publishConfirmation: function(params) {
            context.sandbox.emit('notification.confirm', params); 
        }
    };	

    return exposed;

});