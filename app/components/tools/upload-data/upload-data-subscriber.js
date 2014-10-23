define([
	'./upload-data'
], function (component) {

	var exposed = {
        init: function(context){
            context.sandbox.on('query.stop', component.stopQuery);
            context.sandbox.on('data.clear.all', component.clear);
            context.sandbox.on('menu.opening', component.handleMenuOpening);
            context.sandbox.on('map.layer.delete', component.deleteDataset);  // TODO: find what uses this, if nothing... remove
            context.sandbox.on('data.restore', component.restoreDataset);
        }
    };	

    return exposed;
});