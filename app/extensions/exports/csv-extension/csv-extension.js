define([
'./csv-configuration'
], function(csvConfig) {

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

            app.sandbox.export.options.push(csvConfig);

            app.sandbox.export.csv = function (data) {

            };
        }
	};

	return exposed;





});