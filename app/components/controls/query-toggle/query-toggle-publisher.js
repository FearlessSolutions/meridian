define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        closeQueryTool: function(params) {
            context.sandbox.emit('query.tool.close');
        },
        openQueryTool: function(params) {
            context.sandbox.emit('query.tool.open');
        }
    };

    return exposed;

});