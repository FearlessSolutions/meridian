define([
	'./datagrid-toggle'
], function (datagridToggle) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('system.clear', datagridToggle.clear);
        }
    };	

    return exposed;
});