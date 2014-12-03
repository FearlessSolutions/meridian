define([
	'./google-maps'
], function (download) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('export.google.maps', download.openGoogleMaps);
        }
    };	

    return exposed;
});