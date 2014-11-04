define([
	'./download-geojson'
], function (downloadGeoJSON) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('export.download.geojson', downloadGeoJSON.downloadGeoJSONById);
        }
    };	

    return exposed;
});