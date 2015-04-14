define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        closeDrawTool: function(params) {
            context.sandbox.emit('draw.tool.close');
        },
        openDrawTool: function(params) {
            context.sandbox.emit('draw.tool.open');
        }
    };

    return exposed;

});