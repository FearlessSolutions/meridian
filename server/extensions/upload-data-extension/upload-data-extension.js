define([
    './upload-data-configuration',
    'text!./upload-data-info-win.hbs',
    'text!./upload-data-info-win.css',
    'jquery',
    'handlebars'
], function(configuration, uploadDataInfoWinHBS, uploadDataInfoWinCSS) {
    var template = Handlebars.compile(uploadDataInfoWinHBS),
        DATASOURCE_NAME = 'UPLOADED_FILE',
        context;

    var exposed = {
        "initialize": function(app) {
            context = app;
            app.sandbox.utils.addCSS(uploadDataInfoWinCSS, 'upload-data-extension-style');

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
                },
                "configuration": configuration
            };

            if(!app.sandbox.upload){
                app.sandbox.upload = {};
            }

            //Make separate entries for different file type in case they are different in the future.
            app.sandbox.upload.file = uploadFile;
        }
    };

    function uploadFile(params, callback, errorCallback){
        var formData = new FormData();
        formData.append('file', params.file);

        var url = context.sandbox.utils.getCurrentNodeJSEndpoint() + '/uploadFile' +
            '?queryName={{queryName}}' +
            '&queryId={{queryId}}' +
            '&filetype={{filetype}}' +
            '&classification={{classification}}';
        url = url.replace('{{queryName}}', params.queryName);
        url = url.replace('{{queryId}}', params.queryId);
        url = url.replace('{{filetype}}', params.filetype);
        url = url.replace('{{classification}}', params.classification);

        return $.ajax({
            "type": "POST",
            "url": url,
            "processData": false,
            "contentType": false,
            "data": formData,
            "mimeType": "multipart/form-data",
            "accepts": "application/json",
            "dataType": "json",
            "success": callback,
            "error": errorCallback
        });
    }

    return exposed;

});