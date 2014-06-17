define([
	'./mouse-position'
], function (mousePosition) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.coordinates', mousePosition.updateCoordinates);
            context.sandbox.on('system.clear', mousePosition.clear);
        }
    };	

    return exposed;
});