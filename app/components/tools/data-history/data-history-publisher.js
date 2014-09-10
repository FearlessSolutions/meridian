define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        closeDataHistory: function() {
            context.sandbox.emit('data.history.close');
        },
        openDataHistory: function() {
            context.sandbox.emit('data.history.open');
        },
        publishOpening: function(params){
            context.sandbox.emit('menu.opening', params);
        }
    };

    return exposed;

});