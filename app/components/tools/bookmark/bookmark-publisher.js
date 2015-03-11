define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publishOpening: function(params){
            context.sandbox.emit('menu.opening', params);
        },
        closeBookmark: function() {
            context.sandbox.emit('bookmark.close');
        },
        openBookmark: function() {
            context.sandbox.emit('bookmark.open');
        }
    };

    return exposed;
});