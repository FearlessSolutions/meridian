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

    var exposed = {
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