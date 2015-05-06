define([
	'./cluster-toggle'
], function (clusterToggle) {

    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('notification.confirm', clusterToggle.checkConfirmation);
            context.sandbox.on('data.clear.all', clusterToggle.clear);
        },
        cluster: function(){
            context.sandbox.emit('map.cluster', {});
        },
        uncluster: function(){
            context.sandbox.emit('map.uncluster', {});
        },
        publishNotification: function(params){
            context.sandbox.emit('notification.open', params);  
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        }
    };	

    return exposed;

});