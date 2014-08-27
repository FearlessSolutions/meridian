define([
	'./fake'
], function (dataServiceFake) {
	
	var context;

	var exposed = {
        init: function(thisContext){
			context = thisContext;
            context.sandbox.on('query.execute', dataServiceFake.executeQuery);
            context.sandbox.on('query.stop', dataServiceFake.stopQuery);
            context.sandbox.on('data.clear.all', dataServiceFake.clear);
            context.sandbox.on('map.layer.delete', dataServiceFake.deleteDataset);  // TODO: find what uses this, if nothing... remove
        }
    };	

    return exposed;

});