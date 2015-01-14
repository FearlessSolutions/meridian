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
                var currentDatasetIds = [],
                suffix;

                context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(datasetId, dataset) {
                    currentDatasetIds.push(datasetId);
                });
                suffix = '?ids=' + currentDatasetIds.join();

                context.sandbox.utils.ajax({
                    type: 'HEAD' ,
                    url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/results.csv' + suffix,
                    cache: false
                })
                .done(function(responseText, status, jqXHR) {
                    if (jqXHR.status === 204){
                        callback({
                            messageType: 'warning',
                            messageText: 'No data'
                        });
                    } else {
                        callback({
                            messageType: 'info',
                            messageText: 'CSV download started'
                        });

                        window.location.assign(context.sandbox.utils.getCurrentNodeJSEndpoint() +
                            '/results.csv' + suffix);
                    }
                })
                .error(function(e) {
                    callback({
                        messageType: 'error',
                        messageText: 'Connection to server failed.'
                    });
                });//end of error
            };//end of export.csv
        }//end of initialize
	};//exposed

	return exposed;




function exportToCSV(params, callback){
        
    }
});