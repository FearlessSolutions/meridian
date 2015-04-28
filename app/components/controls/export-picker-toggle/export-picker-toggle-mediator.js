define([
	'./export-picker-toggle'
], function (component) {
	
	var context;

	var exposed = {
        init: function(thisContext) {
			context = thisContext;
            context.sandbox.on('data.clear.all', component.clear);
            context.sandbox.on('export.picker.close', component.removeActive);
        },
        publishMessage: function(params){
            context.sandbox.emit('message.publish', params);
        },
        openModal: function(params) {
            context.sandbox.emit('export.picker.open');
        },
        closeModal: function(params){
            context.sandbox.emit('export.picker.close');
        }
    };	

    return exposed;

});