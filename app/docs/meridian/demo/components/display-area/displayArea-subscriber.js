define([
	'./displayArea'
], function (displayAreaTool) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('show.text', displayAreaTool.updateTextCount);
            context.sandbox.on('modal.display.success', displayAreaTool.updateModalCount);
        }
    };	

    return exposed;
});
