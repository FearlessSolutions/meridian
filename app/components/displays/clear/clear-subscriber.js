define([
	'./clear'
], function (clear) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('clear.menu.open', clear.open);
            context.sandbox.on('data.clear.all', clear.clear);
        }
    };	

    return exposed;
});