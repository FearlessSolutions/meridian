define([
], function(){
    var nodeEndpoint;

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