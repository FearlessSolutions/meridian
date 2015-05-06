define([
], function () {
    var context,
        parent;

	return {
        init: function(thisContext, thisParent) {
            context = thisContext;
            parent = thisParent;
            context.sandbox.on('data.clear.all', parent.clear);
        },
        publishClear: function(args) {
            context.sandbox.emit('data.clear.all', args);
        }
    };	

});