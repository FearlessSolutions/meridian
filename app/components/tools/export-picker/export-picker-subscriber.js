define([
	'./export-picker'
], function (component) {
    var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;

            context.sandbox.on('export.picker.close', component.close);
            context.sandbox.on('export.picker.open', component.open);
            context.sandbox.on('data.clear.all', component.clear);
        }
    };	

    return exposed;
});