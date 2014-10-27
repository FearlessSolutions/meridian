define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        showLegend: function(params) {
            context.sandbox.emit('test.publisher.show', params);
        },
        hideLegend: function(params) {
            context.sandbox.emit('test.publisher.hide', params);
        }
    };

    return exposed;

});
