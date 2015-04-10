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
            context.sandbox.emit('query.tool.open', params);
        },
        openQueryType: function(params) {
            context.sandbox.emit('querytype.open');
        },
        closeQueryType:  function(params) {
            context.sandbox.emit('querytype.close');
        }
    };

    return exposed;

});