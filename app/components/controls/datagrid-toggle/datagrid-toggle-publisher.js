define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        closeDatagrid: function(params) {
            context.sandbox.emit('datagrid.close');
        },
        openDatagrid: function(params) {
            context.sandbox.emit('datagrid.open');
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params);
        }
    };

    return exposed;

});