define([
	'./bookmark'
], function (bookmark) {
    var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;

            context.sandbox.on('bookmark.close', bookmark.closeBookmark);
            context.sandbox.on('bookmark.open', bookmark.openBookmark);
            context.sandbox.on('data.clear.all', bookmark.clear);
            context.sandbox.on('bookmark.create', bookmark.saveBMtoLS);
        },
        closeBookmark: function() {
            context.sandbox.emit('bookmark.close');
        },
        openBookmark: function() {
            context.sandbox.emit('bookmark.open');
        },
        jumpToBookmark: function(params){
            context.sandbox.emit('map.zoom.toLocation', params);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params);
        }
    };	

    return exposed;
});