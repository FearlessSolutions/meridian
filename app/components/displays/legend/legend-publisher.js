define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        hideLegend: function(params) {
            context.sandbox.emit('map.legend.hide', params);
        }
    };

    return exposed;

});