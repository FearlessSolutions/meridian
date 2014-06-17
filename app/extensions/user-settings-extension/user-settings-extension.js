define([
], function() {
    var app;

    var exposed = {
        initialize: function(thisApp) {      
            app = thisApp;

            // TODO: the User is hard-coded to 'john'. This will need to be updated to dynamically grab username
            app.sandbox.utils.extend(true, app.sandbox, app.sandbox.utils.preferences.get('john'));
        }
    };

    return exposed;

});