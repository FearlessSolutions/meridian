define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
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