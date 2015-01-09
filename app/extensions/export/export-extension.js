define([
    './export-configuration-extension'
], function(configuration) {

    var context;

    var exposed = {
        initialize: function(app) {
            context = app;
            app.sandbox.exportOps = configuration.options;

            app.sandbox.exports = {
                sendFeaturesTo: function(dest, callback){
                    
                    if(dest === "export.file.csv"){
                        exportToCSV(dest, callback);
                    }else if(dest === "export.file.kml"){
                        exportToKML(dest, callback);
                    }else if(dest === "export.file.geojson"){
                        exportToGeoJSON(dest, callback);
                    }else if(dest === "export.url.googlemaps"){
                        callback({
                            messageType: 'error',
                            messageText: 'Google Maps export not available'
                        });
                    }
                }
            };
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
            url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/results.*' + suffix,
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
            });
    }

    function exportToGeoJSON(params, callback){
        var currentDatasetIds = [],
            suffix;

        context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(datasetId, dataset) {
            currentDatasetIds.push(datasetId);
        });
        suffix = '?ids=' + currentDatasetIds.join();

        context.sandbox.utils.ajax({
            type: 'HEAD' ,
            url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/results.*' + suffix, //TODO change this
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
                        messageText: 'geoJSON download started'
                    });

                    window.location.assign(context.sandbox.utils.getCurrentNodeJSEndpoint() +
                        '/results.geojson' + suffix);
                }
            })
            .error(function(e) {
                callback({
                    messageType: 'error',
                    messageText: 'Connection to server failed.'
                });
            });
    }


    function exportToKML(params, callback){
        var currentDatasetIds = [],
            suffix;

        context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(datasetId, dataset) {
            currentDatasetIds.push(datasetId);
        });
        suffix = '?ids=' + currentDatasetIds.join();

        context.sandbox.utils.ajax({
            type: 'HEAD' ,
            url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/results.*' + suffix, //TODO change this
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
                        messageText: 'KML download started'
                    });

                    window.location.assign(context.sandbox.utils.getCurrentNodeJSEndpoint() +
                        '/results.kml' + suffix);
                }
            })
            .error(function(e) {
                callback({
                    messageType: 'error',
                    messageText: 'Connection to server failed.'
                });
            });
    }




    function exportToGoogleMaps(params, callback){
       
    }

});