define([
    './user-settings-toggle'
], function (userSettingsToggle) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('settings.close', userSettingsToggle.removeActive);
            context.sandbox.on('settings.open', userSettingsToggle.setActive);
            context.sandbox.on('data.clear.all', userSettingsToggle.clear);
        },
        closeUserSettings: function(params) {
            context.sandbox.emit('settings.close');
        },
        openUserSettings: function(params) {
            context.sandbox.emit('settings.open');
        }
    };	

    return exposed;
});