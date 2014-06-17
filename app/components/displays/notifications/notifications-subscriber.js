define([
	'./notifications'
], function (notificationMessaging) {

    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('message.publish', notificationMessaging.displayMessage);
        }
    };	

    return exposed;

});