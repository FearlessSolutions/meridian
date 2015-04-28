define([
	'./legend-toggle'
], function (legendToggle) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.legend.update', legendToggle.addActiveClass);
            context.sandbox.on('map.legend.show', legendToggle.addActiveClass);
            context.sandbox.on('map.legend.hide', legendToggle.removeActiveClass);
            context.sandbox.on('data.clear.all', legendToggle.removeActiveClass);
        },
        showLegend: function(params) {
            context.sandbox.emit('map.legend.show', params);
        },
        hideLegend: function(params) {
            context.sandbox.emit('map.legend.hide', params);
        }
    };	

    return exposed;
});