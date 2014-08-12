define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        closeDatagrid: function(params) {
            context.sandbox.emit('datagrid.close', params);
        },
        openDatagrid: function(params) {
            context.sandbox.emit('datagrid.open', params);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params);
        }
    };

    return exposed;

});