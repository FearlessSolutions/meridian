define([
    './draw-toggle'
], function (drawToggle) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('draw.tool.close', drawToggle.removeActive);
            context.sandbox.on('map.draw.deactivate', drawToggle.removeActive);
            context.sandbox.on('draw.tool.open', drawToggle.setActive);
            context.sandbox.on('data.clear.all', drawToggle.clear);
        }
    };	

    return exposed;
});