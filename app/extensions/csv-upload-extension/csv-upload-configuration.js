define([
], function(){
    var nodeEndpoint;

    /**
     * @var
     * @instance
     * @property {Function} init - Replaces server endpoint URL found in upload property below.
     * @property {Object} upload - Contains the server endpoint information for the upload CSV capability.
     * @property {String} upload.url - Server endpoint for upload CSV: <url>/importCsv
     * @property {String} upload.type - Property is set to: POST
     * @property {String} upload.dataType - Property is set to: text
     * @property {Number} upload.timeout - Property is set to: 30000
     * @memberof Sandbox.csv 
     */
    var csvUploadConfiguration = {
        "init": function(context){
            csvUploadConfiguration.upload.url =
                csvUploadConfiguration.upload.url.replace(
                    "{{NODE_ENDPOINT}}",
                    context.sandbox.utils.getCurrentNodeJSEndpoint());
        },
        "upload": {
            "url": "{{NODE_ENDPOINT}}" + "/importCsv",
            "type": "POST",
            "dataType": "text",
            "timeout": 30000
        }

    };

    return csvUploadConfiguration;
});