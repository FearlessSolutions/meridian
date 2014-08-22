define([], function(){

    var exposed = {
        initialize: function(app) {
            // Mapping the app.config properties onto sandbox, so components can have access to app-wide properties
            app.sandbox.systemConfiguration = app.config;
        }
    };

    return exposed;
});