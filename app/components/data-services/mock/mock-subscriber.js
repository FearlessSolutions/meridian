define([
	'./mock'
], function (dataServiceMock) {
	
	var context;

	var exposed = {
        init: function(thisContext){
			context = thisContext;
            context.sandbox.on('query.execute', dataServiceMock.executeQuery);
            context.sandbox.on('query.stop', dataServiceMock.stopQuery);
            context.sandbox.on('data.clear.all', dataServiceMock.clear);
            context.sandbox.on('map.layer.delete', dataServiceMock.deleteDataset);  // TODO: find what uses this, if nothing... remove
        }
    };	

    return exposed;

});