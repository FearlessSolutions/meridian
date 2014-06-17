define([
    './clustering'
], function (clustering) {

    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.visualMode', clustering.changeVisualMode);
        }
    };	

    return exposed;

});