define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        closeQueryTool: function(params) {
            context.sandbox.emit('draw.tool.close');
        },
        openQueryTool: function(params) {
            context.sandbox.emit('draw.tool.open');
        }
    };

    return exposed;

});