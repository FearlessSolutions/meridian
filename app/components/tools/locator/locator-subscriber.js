define([
	'./locator'
], function (locatorTool) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('system.clear', locatorTool.clear);
        }
    };	

    return exposed;
});