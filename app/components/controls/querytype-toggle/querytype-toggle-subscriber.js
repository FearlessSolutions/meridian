define([
    './querytype-toggle'
], function (queryTypeToggle) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('query.tool.close', queryTypeToggle.removeActive);
            context.sandbox.on('querytype.open', queryTypeToggle.display);
            context.sandbox.on('data.clear.all', queryTypeToggle.clear);
        }
    };	

    return exposed;
});