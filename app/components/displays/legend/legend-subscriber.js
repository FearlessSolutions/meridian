define([
	'./legend'
], function (legend) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('legend.update', legend.update);
            context.sandbox.on('legend.show', legend.show);
            context.sandbox.on('legend.hide', legend.hide);
            context.sandbox.on('system.clear', legend.clear);
        }
    };	

    return exposed;
});