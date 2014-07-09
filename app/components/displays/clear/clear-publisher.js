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
        publishOpening: function(params){
            context.sandbox.emit('menu.opening', params);
        }
    };

    return exposed;

});