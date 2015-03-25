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
            context.sandbox.on('data.clear.all', parent.clear);
        },
        subscribeOff: function() {
            context.sandbox.off('data.clear.all', parent.clear);
        }
    };	

    return exposed;
});