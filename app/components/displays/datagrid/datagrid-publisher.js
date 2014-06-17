define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        identifyRecord: function(args) {
            context.sandbox.emit('data.record.identify', args);
        }
    };

    return exposed;

});