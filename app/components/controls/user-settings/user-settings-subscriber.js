define([
    './user-settings'
], function (userSettings) {

    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('settings.close', userSettings.close);
            context.sandbox.on('settings.open', userSettings.open);
            context.sandbox.on('menu.opening', userSettings.handleMenuOpening);
            context.sandbox.on('data.clear.all', userSettings.clear);
        }
    };

    return exposed;

});