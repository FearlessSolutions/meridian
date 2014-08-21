define([
	'./event-counter'
], function (eventCountTool) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.features.plot', eventCountTool.update);
            context.sandbox.on('map.features.hide', eventCountTool.update);
            context.sandbox.on('map.features.show', eventCountTool.update);
            context.sandbox.on('map.layer.hide', eventCountTool.update);
            context.sandbox.on('map.layer.hide.all', eventCountTool.update);
            context.sandbox.on('map.layer.show', eventCountTool.update);
            context.sandbox.on('map.layer.delete', eventCountTool.update);
            context.sandbox.on('data.clear.all', eventCountTool.clear);
            context.sandbox.on('eventcounter.update', eventCountTool.update); // TODO: Remove hack once hide/show updates stateManager
        }
    };	

    return exposed;
});