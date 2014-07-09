define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        identifyRecord: function(params) {
            context.sandbox.emit('data.record.identify', params);
        }
    };

    return exposed;

});