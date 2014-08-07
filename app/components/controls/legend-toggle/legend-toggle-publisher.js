define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        showLegend: function(params) {
            context.sandbox.emit('map.legend.show', params);
        },
        hideLegend: function(params) {
            context.sandbox.emit('map.legend.hide', params);
        }
    };

    return exposed;

});