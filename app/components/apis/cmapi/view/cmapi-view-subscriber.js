/**
 * subscriber for cmapi-overlay
 * Does nothing for now.
 */
define([
    './cmapi-view'
], function (cmapiView) {
    var context,
        parent;

	var exposed = {
        init: function(thisContext, thisParent) {
            context = thisContext;
            parent = thisParent;
            exposed.start();
        },
        start: function(args) {
        },
        stop: function(args) {
        }
    };	

    return exposed;
});