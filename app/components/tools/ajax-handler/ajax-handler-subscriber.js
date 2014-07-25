/**
 * This maps certain channels to the ajax-handler-extension (directly)
 */
define([
    './ajax-handler'
], function (ajaxHandler) {
	var context;

	var exposed = {
        init: function(thisContext) {
			context = thisContext;
            context.sandbox.on('query.stop', ajaxHandler.stopQuery);
            context.sandbox.on('data.clear.all', ajaxHandler.clearAll);
        }
    };	

    return exposed;
});