define([
], function () {
    var context,
        parent;

	var exposed = {
        init: function(thisContext, thisParent){
            context = thisContext;
            parent = thisParent;

//            context.sandbox.on('map.view.status', parent.emitViewStatus);
        }
    };	

    return exposed;
});