define([
    'text!./splash-screen.hbs'
], function(splashTemplate) {

    var exposed = {
        initialize: function(app) {
			if (!app.sandbox.splashScreen) {
				app.sandbox.splashScreen = {};
			}
            app.sandbox.splashScreen.template = splashTemplate;
        }
    };

    return exposed;

});