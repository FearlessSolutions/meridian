define([
	'./mock'
], function (dataServiceMock) {
	
	var context;

	var exposed = {
        init: function(thisContext) {
			context = thisContext;
            context.sandbox.on('query.execute', dataServiceMock.executeQuery);
            context.sandbox.on('query.stop', dataServiceMock.stopQuery);
            context.sandbox.on('data.clear.all', dataServiceMock.clear);
            context.sandbox.on('map.layer.delete', dataServiceMock.deleteDataset);  // TODO: find what uses this, if nothing... remove
            context.sandbox.on('data.restore', dataServiceMock.restoreDataset);
        },
        createLayer: function(params) {
            context.sandbox.emit('map.layer.create', params);
        },
        plotFeatures: function(params) {
            context.sandbox.emit('map.features.plot', params);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        },
        publishFinish: function(params) {
            context.sandbox.emit('data.finished', params);
        },
        publishError: function(params) {
            context.sandbox.emit('data.error', params);
        },
        addToProgressQueue: function() {
            context.sandbox.emit('progress.queue.add');
        },
        removeFromProgressQueue: function() {
            context.sandbox.emit('progress.queue.remove');
        }
    };	

    return exposed;

});