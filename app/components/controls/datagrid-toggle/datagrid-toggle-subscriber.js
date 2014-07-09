define([
	'./datagrid-toggle'
], function (datagridToggle) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('data.clear.all', datagridToggle.clear);
        }
    };	

    return exposed;
});