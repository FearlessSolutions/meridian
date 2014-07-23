define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        createLayer: function(args){
            context.sandbox.emit('map.layer.create', args);
        },
        publishData: function(args){
            context.sandbox.emit('map.features.plot', args);
        },
        publishMessage: function(args){
            context.sandbox.emit('message.publish', args);
        }
    };

    return exposed;
});