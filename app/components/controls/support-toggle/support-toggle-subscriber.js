define([
    './support-toggle'
], function (supportToggle) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('support.close', supportToggle.removeActive);
            context.sandbox.on('support.open', supportToggle.setActive);
            context.sandbox.on('data.clear.all', supportToggle.clear);
        }
    };	

    return exposed;
});