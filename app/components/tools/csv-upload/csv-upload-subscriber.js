define([
	'./csv-upload'
], function (csvUploader) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('system.clear', csvUploader.clear);
            context.sandbox.on('menu.opening', csvUploader.handleMenuOpening);
        }
    };	

    return exposed;
});