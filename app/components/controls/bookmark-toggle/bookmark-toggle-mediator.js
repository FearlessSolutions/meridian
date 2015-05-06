define([
    './bookmark-toggle'
], function(bookmarkToggle){

    var context;

    var exposed = {
          init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('bookmark.close', bookmarkToggle.removeActive);
            context.sandbox.on('bookmark.open', bookmarkToggle.setActive);
            context.sandbox.on('data.clear.all', bookmarkToggle.removeActive);
        },
        closeBookmark: function(params) {
            context.sandbox.emit('bookmark.close');
        },
        openBookmark: function(params) {
            context.sandbox.emit('bookmark.open');
        }
    };

    return exposed;

});