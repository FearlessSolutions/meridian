define([
	'./aoi'
], function (aoi) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;

            context.sandbox.on('map.layer.create', aoi.createAOI);
            context.sandbox.on('map.features.plot', aoi.updateAOI);
        }
    };	

    return exposed;
});