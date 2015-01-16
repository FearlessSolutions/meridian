define([
	'./geojson-export'
], function (component) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('export.download.geojson', component.exporter);
        }
    };	

    return exposed;
});