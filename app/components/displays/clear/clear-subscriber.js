define([
	'./clear'
], function (clear) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('clear.menu.open', clear.open);
            context.sandbox.on('system.clear', clear.clear);
        }
    };	

    return exposed;
});