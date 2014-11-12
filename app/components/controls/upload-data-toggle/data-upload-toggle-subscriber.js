define([
	'./data-upload-toggle'
], function (toggle) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('tool.upload.show', toggle.addActiveClass);
            context.sandbox.on('tool.upload.hide', toggle.removeActiveClass);
            context.sandbox.on('data.clear.all', toggle.removeActiveClass);
        }
    };	

    return exposed;
});