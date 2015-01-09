define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishMessage: function(params){
            context.sandbox.emit('message.publish', params);
        },
        publishOpening: function(params){
            context.sandbox.emit('menu.opening', params);
        },
        close: function() {
            context.sandbox.emit('export.picker.close');
        },
        open: function() {
            context.sandbox.emit('export.picker.open');
        },
        export: function(params){
            context.sandbox.emit(params.channel);
        }
    };

    return exposed;
});