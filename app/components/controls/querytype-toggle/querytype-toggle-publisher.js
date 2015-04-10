define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        setClick:function() {
            context.sandbox.emit('querytype.setclick');
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