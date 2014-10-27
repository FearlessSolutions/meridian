define([
	'./support'
], function (support) {
    var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;

            context.sandbox.on('support.close', support.close);
            context.sandbox.on('support.open', support.open);
            context.sandbox.on('data.clear.all', support.clear);
        }
    };	

    return exposed;
});