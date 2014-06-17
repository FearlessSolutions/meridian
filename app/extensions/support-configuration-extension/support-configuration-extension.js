define([
    './support-configuration'
], function(supportConfiguration) {

    var exposed = {
        initialize: function(app) {
            app.sandbox.supportConfiguration = supportConfiguration;
        }
    };

    return exposed;

});