define([
	'./modalDisplay'
], function (modalDisplayTool) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('show.text', modalDisplayTool.openModal);
        }
    };	

    return exposed;
});
