define([
    './query-toggle'
], function (queryToggle) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('query.tool.close', queryToggle.removeActive);
            context.sandbox.on('query.tool.open', queryToggle.setActive);
            context.sandbox.on('data.clear.all', queryToggle.clear);
        }
    };	

    return exposed;
});