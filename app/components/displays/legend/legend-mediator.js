define([
	'./legend'
], function (legend) {
    var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('map.legend.update', legend.update);
            context.sandbox.on('map.legend.show', legend.show);
            context.sandbox.on('map.legend.hide', legend.hide);
            context.sandbox.on('data.clear.all', legend.clear);
        },
        hideLegend: function(params) {
            context.sandbox.emit('map.legend.hide', params);
        }
    };	

    return exposed;
});