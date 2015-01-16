define([
	'./googlemaps-export'
], function (component) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('export.url.googlemaps', component.exporter);
        }
    };	

    return exposed;
});