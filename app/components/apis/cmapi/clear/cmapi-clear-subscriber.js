/**
 * subscriber for cmapi-overlay
 * Does nothing for now.
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
            // TODO: if you want to notify CMAPI subscribers of changes to overlays, connect this up
        },
        subscribeOff: function() {
            // TODO: if you want to notify CMAPI subscribers of changes to overlays, connect this up         
        }
    };	

    return exposed;
});