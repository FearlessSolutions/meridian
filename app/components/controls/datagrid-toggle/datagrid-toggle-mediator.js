define([
	'./datagrid-toggle'
], function (datagridToggle) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('datagrid.close', datagridToggle.removeActive);
            context.sandbox.on('datagrid.open', datagridToggle.setActive);
            context.sandbox.on('data.clear.all', datagridToggle.clear);
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