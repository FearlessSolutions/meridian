define([
	'./support'
], function (supportDialog) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;

            context.sandbox.on('menu.opening', supportDialog.handleMenuOpening);
        }
    };	

    return exposed;
});