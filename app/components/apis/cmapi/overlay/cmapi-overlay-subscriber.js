/**
 * subscriber for cmapi-overlay
 * Does nothing for now.
 */
define([
], function () {
    var context,
        parent;

	var exposed = {
        init: function(thisContext, thisParent){
            context = thisContext;
            parent = thisParent;

            exposed.start();
        },
        start: function(args){
            exposed.subscribeOn();
        },
        stop: function(args){
        	exposed.subscribeOff();
        },
        subscribeOn: function(){
         //   context.sandbox.on('data.add', olMapRenderer.plotFeatures);
        },
        subscribeOff: function(){
            //context.sandbox.off('data.add', olMapRenderer.plotFeatures);           
        }
    };	

    return exposed;
});