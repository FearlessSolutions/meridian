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
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params);
        },
        publishOpening: function(params){
            context.sandbox.emit('menu.opening', params);
        },
        zoomToLocation: function(params){
            context.sandbox.emit('map.zoom.toLocation',params);
        },
        changeBasemap: function(params) {
            context.sandbox.emit('map.basemap.change', params);
        },
        closeUserSettings: function() {
            context.sandbox.emit('settings.close');
        },
        openUserSettings: function() {
            context.sandbox.emit('settings.open');
        }
    };

    return exposed;

});