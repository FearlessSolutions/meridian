define([
	'./history-log'
], function (historyLog) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('message.publish', historyLog.logNotification);
        }
    };	

    return exposed;
});