define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        closeBookmark: function(params) {
            context.sandbox.emit('bookmark.close', params);
        },
        openBookmark: function(params) {
            context.sandbox.emit('bookmark.open', params);
        }
    };

    return exposed;

});