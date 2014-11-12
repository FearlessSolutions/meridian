define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        showLegend: function(params) {
            context.sandbox.emit('tool.upload.show', params);
        },
        hideLegend: function(params) {
            context.sandbox.emit('tool.upload.hide', params);
        }
    };

    return exposed;

});