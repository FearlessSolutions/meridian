define([
], function () {

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishClear: function(){
            context.sandbox.emit('system.clear');
        },
        publishOpening: function(args){
            context.sandbox.emit('menu.opening', args);
        }
    };

    return exposed;

});