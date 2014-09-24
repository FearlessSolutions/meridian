/**
 * subscriber for cmapi-overlay
 * Does nothing for now.
 */
define([
    './cmapi-clear'
], function (cmapiClear) {
    var context,
        parent;

	var exposed = {
        "init": function(thisContext, thisParent) {
            context = thisContext;
            parent = thisParent;

            exposed.start();
        },
        "start": function(args) {
            exposed.subscribeOn();
        },
        "stop": function(args) {
            exposed.subscribeOff();
        },
        "subscribeOn": function() {
            context.sandbox.on('data.clear.all', cmapiClear.clear);
        },
        "subscribeOff": function() {
            context.sandbox.off('data.clear.all', cmapiClear.clear);
        }
    };	

    return exposed;
});