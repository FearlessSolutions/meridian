define([
], function () {

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishOpenClearDialog: function(args){
            context.sandbox.emit('clear.menu.open', args);
        }
    };

    return exposed;

});