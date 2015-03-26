define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
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