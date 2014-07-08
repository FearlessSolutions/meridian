define([
	'./event-counter'
], function (eventCountTool) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('data.add', eventCountTool.update);
            context.sandbox.on('map.layer.hide', eventCountTool.update);
            context.sandbox.on('map.layer.hide.all', eventCountTool.update);
            context.sandbox.on('map.layer.show', eventCountTool.update);
            context.sandbox.on('system.clear', eventCountTool.clear);
        }
    };	

    return exposed;
});