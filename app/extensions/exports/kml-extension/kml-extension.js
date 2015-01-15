define([
'./kml-configuration'
], function(configuration) {

    var context;
	var exposed = {
		initialize: function(app) {
            context = app;

            if(!app.sandbox.export){
                throw 'Requires export-utils extension to be loaded.'
            }

            app.sandbox.export.utils.addExport({
                id: configuration.id,
                option: configuration,
                export: exportFunction,
                verify: verify
            });
        }
	};

    function exportFunction(params){

    }

    function verify(params){

    }

	return exposed;
});