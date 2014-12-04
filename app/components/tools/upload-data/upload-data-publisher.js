define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        createLayer: function(params){
            context.sandbox.emit('map.layer.create', params);
        },
        publishData: function(params){
            context.sandbox.emit('map.features.plot', params);
        },
        publishMessage: function(params){
            context.sandbox.emit('message.publish', params);
        },
        publishFinished: function(params){
            context.sandbox.emit('data.finished', params);
        },
        publishError: function(params){
            context.sandbox.emit('data.error', params);
        },
        publishZoomToLayer: function(params){
            context.sandbox.emit('map.zoom.toLayer', params);
        },
        addToProgressQueue: function() {
            context.sandbox.emit('progress.queue.add');
        },
        removeFromProgressQueue: function() {
            context.sandbox.emit('progress.queue.remove');
        },
        openUploadTool: function(){
            context.sandbox.emit('tool.upload.show');
        },
        closeUploadTool: function(){
            context.sandbox.emit('tool.upload.hide');
        }
    };

    return exposed;
});