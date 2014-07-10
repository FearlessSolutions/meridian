define([
	'./mouse-position'
], function (mousePosition) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('mouse.position.change', mousePosition.updateCoordinates);
            context.sandbox.on('data.clear.all', mousePosition.clear);
        }
    };	

    return exposed;
});