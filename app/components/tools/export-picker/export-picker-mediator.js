define([
	'./export-picker'
], function (component) {
    var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;

            context.sandbox.on('export.picker.close', component.close);
            context.sandbox.on('export.picker.open', component.open);
            context.sandbox.on('data.clear.all', component.clear);
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
            context.sandbox.emit(params.channel, params);
        }
    };	

    return exposed;
});