define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        closeSupport: function(params) {
            context.sandbox.emit('support.close');
        },
        openSupport: function(params) {
            context.sandbox.emit('support.open');
        }
    };

    return exposed;

});