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
        openModal: function(params) {
            context.sandbox.emit('export.picker.open');
        },
        closeModal: function(params){
            context.sandbox.emit('export.picker.close');
        }
    };

    return exposed;
});