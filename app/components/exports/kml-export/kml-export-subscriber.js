define([
	'./kml-export'
], function (component) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('export.download.kml', component.exporter);
        }
    };	

    return exposed;
});