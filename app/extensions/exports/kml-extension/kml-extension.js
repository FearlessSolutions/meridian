define([
'./kml-configuration'
], function(kmlConfig) {

    var context;
	var exposed = {
		initialize: function(app) {
            context = app;

            if(!app.sandbox.export){
                app.sandbox.export = {};
            }

            if (!app.sandbox.export.options) {
                app.sandbox.export.options = [];
            }

            app.sandbox.export.options.push(kmlConfig);

            app.sandbox.export.kml = function (data) {

            };
        }
	};

	return exposed;





});