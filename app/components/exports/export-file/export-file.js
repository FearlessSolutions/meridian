define([
    './export-file-publisher'
], function(publisher) {

    var context;

    var exposed = {

        init: function(thisContext) {
            context = thisContext;
        },
        export: {
            csv: function(params){
                //params.queryId ect?
                //params.features ? []
                context.sandbox.export.file.csv(params, function(status){
                    //TODO print out status? This would solve some philosophy problems?
                    //TODO add to ajaxHandler? I don't think it is required.

                    publisher.publishMessage({
                        messageType: status.type,
                        messageTitle: 'Download File',
                        messageText: status.message
                    });
                });
            },
            kml: function(params){
                context.sandbox.export.file.kml(params, function(status){

                });
            },
            geojson: function(params){
                context.sandbox.export.file.geojson(params, function(status){

                });
            }
        }       
    };


    return exposed;

});
