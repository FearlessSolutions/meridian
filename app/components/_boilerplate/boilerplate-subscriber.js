define([
	'./boilerplate'
], function (boilerplate) {

    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;

            // The 'on' function subscribes to the specified channel and calls dummyFunction
            // If there are args passed along the channel, then those are passed to dummyFunction
            context.sandbox.on('map.zoom.in', boilerplate.dummyFunction);
        }
    };	

    return exposed;

});