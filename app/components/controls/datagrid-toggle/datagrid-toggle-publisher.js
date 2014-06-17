define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        toogleGrid: function(args) {
            context.sandbox.emit('map.datagrid.toggle', args);
        },
        publishMessage: function(args) {
            context.sandbox.emit('message.publish', args);
        }
    };

    return exposed;

});