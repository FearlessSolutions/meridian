define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
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