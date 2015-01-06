define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        openModal: function(params) {
            context.sandbox.emit('export.picker.open', params);
        },
        closeModal: function(params){
            context.sandbox.emit('export.picker.close', params);
        }
    };

    return exposed;
});