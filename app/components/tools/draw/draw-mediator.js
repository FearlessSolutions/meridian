define([
	'./draw'
], function (drawTool) {
    var context,
        params;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('draw.tool.close', drawTool.reset);
            context.sandbox.on('draw.tool.open', drawTool.open);
            context.sandbox.on('map.draw.stop', drawTool.saveShape)
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        },
        drawBBox: function() {
            context.sandbox.emit('map.draw.start');
        },
        removeBBox: function() {
            context.sandbox.emit('map.draw.clear');
        },
        clear: function(){
            context.sandbox.emit("data.clear.all");
        },
        closeDrawTool: function(params) {
            context.sandbox.emit('draw.tool.close');
        },
        plotFeatures: function(params) {
            context.sandbox.emit('map.features.plot', params);
        },
        setLayerIndex: function(params) {
            context.sandbox.emit('map.layer.index.set', params);
        },
        publishCoords: function(params) {
            context.sandbox.emit('map.feature.draw', params);
        }
    };	

    return exposed;
});