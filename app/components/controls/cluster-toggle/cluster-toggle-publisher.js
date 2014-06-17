define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        cluster: function(){
            context.sandbox.emit('map.cluster', {});
        },
        uncluster: function(){
            context.sandbox.emit('map.uncluster', {});
        },
        publishNotification: function(args){
            context.sandbox.emit('notification.open', args);  
        },
        publishMessage: function(args) {
            context.sandbox.emit('message.publish', args); 
        }
    };

    return exposed;

});