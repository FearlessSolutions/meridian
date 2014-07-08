define([
	'./mock'
], function (dataServiceMock) {
	
	var context;

	var exposed = {
        init: function(thisContext){
			context = thisContext;
            context.sandbox.on('query.execute', dataServiceMock.executeQuery);
            context.sandbox.on('query.stop', dataServiceMock.stop);
            context.sandbox.on('system.clear', dataServiceMock.clear);
        }
    };	

    return exposed;

});