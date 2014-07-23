define([
    './user-settings'
], function (userSettings) {

    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('menu.opening', userSettings.handleMenuOpening);
        }
    };

    return exposed;

});