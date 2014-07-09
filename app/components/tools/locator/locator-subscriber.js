define([
	'./locator'
], function (locatorTool) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('data.clear.all', locatorTool.clear);
        }
    };	

    return exposed;
});