define([
    './data-history'
], function (dataHistory) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('data.history.close', dataHistory.close);
            context.sandbox.on('data.history.open', dataHistory.open);
            context.sandbox.on('data.clear.all', dataHistory.clear);
        }
    };	

    return exposed;
});