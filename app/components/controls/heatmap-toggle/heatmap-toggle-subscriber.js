define([
	'./heatmap-toggle'
], function (heatmapToggle) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('menu.opening', heatmapToggle.handleMenuOpening);
        }
    };	

    return exposed;
});