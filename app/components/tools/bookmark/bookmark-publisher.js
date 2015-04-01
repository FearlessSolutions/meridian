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
        jumpToBookmark: function(params){
            context.sandbox.emit('map.zoom.toLocation', params);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params);
        }
    };

    return exposed;
});