define([
    './querytype-toggle'
], function (queryTypeToggle) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('query.tool.close', queryToggle.removeActive);
            context.sandbox.on('querytype.open', queryTypeToggle.setActive);
            context.sandbox.on('data.clear.all', queryToggle.clear);
        }
    };	

    return exposed;
});