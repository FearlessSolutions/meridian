define([
    './export-file-extension-configuration'
], function(configuration) {

    var context,
        EXPORT_TYPE = 'file';

    var exposed = {
        initialize: function(app) {
            context = app;

            // Set up export options for picker
            if(!context.sandbox.export){
                context.sandbox.export = {
                    options: []
                };
            }else if(context.sandbox.export[EXPORT_TYPE]){
                console.error('Duplicate export extension found', EXPORT_TYPE);

                return; //Don't add anything to the sandbox
            }else if (!context.sandbox.export.options){
                context.sandbox.export.options = [];
            }

            //Setup up functions for file export component
            context.sandbox.export[EXPORT_TYPE] = {
                csv: exportToCSV,
                kml: function(params, callback){
                    alert('holder for exporting to kml');
                },
                geojson: function(params, callback){
                    alert('holder for exporting to geojson');
                }
            };

            //Add these export options to picker
            configuration.exportOptions.forEach(function(option){
                context.sandbox.export.options.push(option);
            });
        }
    };

    return exposed;


    function exportToCSV(params, callback){
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
                        type: 'warning',
                        message: 'No data'
                    });
                } else {
                    callback({
                        type: 'info',
                        message: 'CSV download started'
                    });

                    window.location.assign(context.sandbox.utils.getCurrentNodeJSEndpoint() +
                        '/results.csv' + suffix);
                }
            })
            .error(function(e) {
                callback({
                    type: 'error',
                    message: 'Connection to server failed.'
                });
            });
    }
});