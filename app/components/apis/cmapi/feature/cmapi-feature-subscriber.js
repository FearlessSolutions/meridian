/**
 * Subscriber for cmapi-feature
 * Doesn't do anything right now, but might in the future
 */
define([
], function () {
    var context,
        parent;

	var exposed = {
        init: function(thisContext, thisParent) {
            context = thisContext;
            parent = thisParent;

            exposed.start();
        },
        start: function(args) {
            exposed.subscribeOn();
        },
        stop: function(args) {
            exposed.subscribeOff();
        },
        subscribeOn: function() {
         //   context.sandbox.on('map.features.plot', olMapRenderer.plotFeatures);
        },
        subscribeOff: function() {
            //context.sandbox.off('map.features.plot', olMapRenderer.plotFeatures);           
        }
    };	

    return exposed;
});