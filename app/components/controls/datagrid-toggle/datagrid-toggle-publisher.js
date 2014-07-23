define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        toogleGrid: function(params) {
            context.sandbox.emit('map.datagrid.toggle', params);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params);
        }
    };

    return exposed;

});