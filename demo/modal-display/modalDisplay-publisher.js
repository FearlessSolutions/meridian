define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        emitSuccess: function(params){
            context.sandbox.emit('modal.display.success'); 
        }
    };

    return exposed;

});