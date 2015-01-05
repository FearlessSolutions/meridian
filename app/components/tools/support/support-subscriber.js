define([
	'./support'
], function (support) {
    var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;

            context.sandbox.on('support.close', support.closeSupport);
            context.sandbox.on('support.open', support.openSupport);
            context.sandbox.on('about.close', support.closeAbout);
            context.sandbox.on('about.open', support.openAbout);
            context.sandbox.on('data.clear.all', support.clear);
        }
    };	

    return exposed;
});