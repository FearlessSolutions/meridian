define([
], function () {
	var context;

	var exposed = {
        "init": function(thisContext) {
            context = thisContext;
        },
        "publishOpening": function(args){
            context.sandbox.emit('menu.opening', args);
        },
        "createLayer": function(args){
            context.sandbox.emit('map.layer.create', args);
        },
        "publishData": function(args){
            context.sandbox.emit('map.features.plot', args);
        },
        "publishMessage": function(args){
            context.sandbox.emit('message.publish', args);
        },
        "publishFinished": function(args){
            context.sandbox.emit('data.finished', args);
        },
        "publishError": function(args){
            context.sandbox.emit('data.error', args);
        },
        "addToProgressQueue": function() {
            context.sandbox.emit('progress.queue.add');
        },
        "removeFromProgressQueue": function() {
            context.sandbox.emit('progress.queue.remove');
        }
    };

    return exposed;
});