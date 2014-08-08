define([
	'./progress-notification'
], function (progressNotification) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('progress.queue.add', progressNotification.addToQueue);
            context.sandbox.on('progress.queue.remove', progressNotification.removeFromQueue);
            context.sandbox.on('data.clear.all', progressNotification.removeActiveClass);
        }
    };	

    return exposed;
});