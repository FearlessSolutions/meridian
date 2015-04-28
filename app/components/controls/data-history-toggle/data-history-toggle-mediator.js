define([
    './data-history-toggle'
], function (dataHistoryToggle) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('data.history.close', dataHistoryToggle.removeActive);
            context.sandbox.on('data.history.open', dataHistoryToggle.setActive);
            context.sandbox.on('data.clear.all', dataHistoryToggle.clear);
        },
        closeDataHistory: function(params) {
            context.sandbox.emit('data.history.close');
        },
        openDataHistory: function(params) {
            context.sandbox.emit('data.history.open');
        }
    };	

    return exposed;
});