define([
	'./csv-upload'
], function (csvUploader) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('data.clear.all', csvUploader.clear);
            context.sandbox.on('menu.opening', csvUploader.handleMenuOpening);
        }
    };	

    return exposed;
});