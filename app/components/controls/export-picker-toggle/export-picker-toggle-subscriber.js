define([
	'./export-picker-toggle'
], function (component) {
	
	var context;

	var exposed = {
        init: function(thisContext) {
			context = thisContext;
            context.sandbox.on('data.clear.all', component.clear);
            context.sandbox.on('export.picker.open', component.setActive);
            context.sandbox.on('export.picker.close', component.removeActive);
        }
    };	

    return exposed;

});