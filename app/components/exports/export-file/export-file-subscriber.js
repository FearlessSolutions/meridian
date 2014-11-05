define([
	'./export-file'
], function (component) {
	
	var context;

	var exposed = {
        init: function(thisContext) {
			context = thisContext;
            context.sandbox.on('export.file.csv', component.export.csv);
            context.sandbox.on('export.file.kml', component.export.kml);
            context.sandbox.on('export.file.geojson', component.export.geojson);
        }
    };	

    return exposed;

});