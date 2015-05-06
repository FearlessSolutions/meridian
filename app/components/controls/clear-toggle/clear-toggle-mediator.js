define([
], function () {

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        openClearDialog: function(params){
            context.sandbox.emit('clear.menu.open', params);
        }
    };

    return exposed;

});