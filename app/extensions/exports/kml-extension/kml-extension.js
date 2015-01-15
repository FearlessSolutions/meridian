define([
'./kml-configuration'
], function(configuration) {

    var context;
	var exposed = {
		initialize: function(app) {
            context = app;

            if(!app.sandbox.export){
                app.sandbox.export = {
                    export: {},
                    options: [],
                    validate: {}
                };
            }

            app.sandbox.export.options.push(configuration);

            app.sandbox.export.export[configuration.id] = function (data) {

            };

            app.d
        }
	};
	return exposed;
});