define([
	'./mock2'
], function (dataServiceMock2) {
	
	var context;

	var exposed = {
        init: function(thisContext){
			context = thisContext;
            context.sandbox.on('query.execute', dataServiceMock2.executeQuery);
            context.sandbox.on('query.stop', dataServiceMock2.stopQuery);
            context.sandbox.on('data.clear.all', dataServiceMock2.clear);
            context.sandbox.on('map.layer.delete', dataServiceMock2.deleteDataset);  // TODO: find what uses this, if nothing... remove
        }
    };	

    return exposed;

});