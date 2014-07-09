define([
], function () {

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishClear: function(){
            context.sandbox.emit('data.clear.all');
        },
        publishOpening: function(params){
            context.sandbox.emit('menu.opening', params);
        }
    };

    return exposed;

});