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
        }
    };	

    return exposed;
});