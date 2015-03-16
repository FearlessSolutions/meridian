define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        closeBookmark: function() {
            context.sandbox.emit('bookmark.close');
        },
        openBookmark: function() {
            context.sandbox.emit('bookmark.open');
        },
        publishOpening: function(params){
            context.sandbox.emit('menu.opening', params);
        },
        restoreDataset: function(params) {
            context.sandbox.emit('data.restore', params);
        },
        deleteDataset: function(params) {
            context.sandbox.emit('map.layer.delete', params);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params);
        }
    };

    return exposed;
});