define([
	'./csv-export'
], function (component) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('export.download.csv', component.exporter);
        }
    };	

    return exposed;
});