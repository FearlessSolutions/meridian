define([
    './clustering'
], function (clustering) {

    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.visualMode', clustering.changeVisualMode);
            context.sandbox.on('system.clear', clustering.clear);
        }
    };	

    return exposed;

});