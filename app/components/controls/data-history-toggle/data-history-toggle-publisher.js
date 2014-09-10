define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        closeDataHistory: function(params) {
            context.sandbox.emit('data.history.close');
        },
        openDataHistory: function(params) {
            context.sandbox.emit('data.history.open');
        }
    };

    return exposed;

});