define([
    './csv-upload-configuration',
    'text!./csv-upload-info-win.hbs',
    'text!./csv-upload-info-win.css',
    'jquery',
    'handlebars'
], function(csvUploadConfiguration, csvUploadInfoWinHBS, csvUploadInfoWinCSS) {
    var template = Handlebars.compile(csvUploadInfoWinHBS),
        DATASOURCE_NAME = 'csv',
        context;
    /**
     * @namespace Sandbox.csv
     * @memberof Sandbox
     */
    /**
     * @exports csv-upload-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.csv} to the {@link Sandbox} namespace.
         * @function
         * @instance
         * @param {Object} app Instance of the Meridian application.
         */
        initialize: function(app) {
            context = app;
            app.sandbox.utils.addCSS(csvUploadInfoWinCSS, 'csv-upload-extension-style');
            csvUploadConfiguration.init(app);

            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }
            app.sandbox.dataServices[DATASOURCE_NAME] = {
                "infoWinTemplate": {
                    "buildInfoWinTemplate": function(attributes){
                        var html = template({
                            "attributes": attributes,
                            "classification": attributes.classification,
                            "thumbnail": "./extensions/map-configuration-extension/images/markerIcons/marker.png"
                        });

                        return html;
                    },
                    "postRenderingAction": function(){}
                }
            };

            if(!app.sandbox.csv){
                app.sandbox.csv = {};
            }
            app.sandbox.csv.upload = upload;
            app.sandbox.csv.parse = parse;
        }
    };

    return exposed;

    /**
     * @function
     * @instance
     * @param {String} csv - CSV content/data.
     * @param {String} queryId - Id of the query.
     * @param {String} queryName - Name of the query.
     * @param {Function} callback - Executed when ajax is done.
     * @param {Function} errorCallback - Executed when ajax throws an error.
     * @memberof Sandbox.csv
     */
    function upload(csv, queryId, queryName, callback, errorCallback){
        var options = csvUploadConfiguration.upload;
        options.data = {
            "data": csv,
            "queryName": queryName,
            "queryId": queryId
        };

        return $.ajax(options)
            .done(callback)
            .error(errorCallback);
    }

    /**
     * Parses and stores data in sandbox.dataStorage using queryId as the datasetId.
     * @function
     * @instance
     * @param {Object} data - CSV content/data.
     * @param {String} queryId - Id of the query.
     * @memberof Sandbox.csv
     */
    function parse(data, queryId){
        data.forEach(function(feature, index){
            var newValue = {};
            newValue.id = feature.id = feature.properties.featureId;

            $.each(feature.properties, function(key, value){
                newValue[key] = value;
            });

            newValue.lat = feature.geometry.coordinates[1];
            newValue.lon = feature.geometry.coordinates[0];
            newValue.dataService = data[index].dataService = DATASOURCE_NAME;

            context.sandbox.dataStorage.addData({
                "datasetId": queryId,
                "data": newValue
            });
        });
    }
});