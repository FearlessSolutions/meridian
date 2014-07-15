/**
 * This maps certain channels to the ajax-handler-extension (directly)
 */
define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext){
			context = thisContext;
            context.sandbox.on('query.stop', context.sandbox.ajax.stopQuery);
            context.sandbox.on('data.clear.all', context.sandbox.ajax.clear);
        }
    };	

    return exposed;
});