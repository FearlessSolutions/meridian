define([
    './csv-configuration'
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
                validate: validate
            });

        }//end of initialize
	};//exposed

    function exportFunction(params){
        var  suffix = '?ids=' + params.layerIds.join();

        context.sandbox.utils.ajax({
            type: 'HEAD' ,
            url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/results.csv' + suffix,
            cache: false
        })
            .done(function(responseText, status, jqXHR) {
                if (jqXHR.status === 204){
                    params.callback({
                        messageType: 'warning',
                        messageText: 'No data'
                    });
                } else {
                    params.callback({
                        messageType: 'info',
                        messageText: 'CSV download started'
                    });

                    window.location.assign(context.sandbox.utils.getCurrentNodeJSEndpoint() +
                        '/results.csv' + suffix);
                }
            })
            .error(function(e) {
                params.callback({
                    messageType: 'error',
                    messageText: 'Connection to server failed.'
                });
            });//end of error
    }

    function validate(params){
        var valid = false;

        if(params.featureId){
            valid = false;
        } else if(params.layerIds){
            valid = context.sandbox.export.utils.validateExportForLayerByDatasource(
                configuration.id,
                params.layerIds
            );
        } else{
            valid = false;
        }

        params.callback(valid);
    }

	return exposed;
});