define([
    './download-publisher',
    'bootstrap'
], function(publisher){

    var context,
        $downloadButton;

    var exposed = {
        "init": function(thisContext) {
            context = thisContext;
            $downloadButton = context.$('#downloadButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $downloadButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $downloadButton.on('click', function(event) {
                event.preventDefault();

                if(context.sandbox.utils.size(context.sandbox.dataStorage.datasets) === 0){
                    publishCantDownload();
                    return;
                }

                //Not adding to ajaxHandler, because it would then have to handle clear, and we don't have a good way around that.

                var currentDatasetIds = [],
                    suffix;

                context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(datasetId, dataset) {
                    currentDatasetIds.push(datasetId);
                });
                suffix = '?ids=' + currentDatasetIds.join();

                context.sandbox.utils.ajax({
                    "type": "HEAD" ,
                    "url": context.sandbox.utils.getCurrentNodeJSEndpoint() + '/results.csv' + suffix,
                    "cache": false
                })
                    .done(function(responseText, status, jqXHR) {
                        if (jqXHR.status === 204){
                            publishCantDownload();
                        } else {
                            publisher.publishMessage({
                                "messageType": "success",
                                "messageTitle": "CSV Download",
                                "messageText": "CSV Download started."
                            });

                            window.location.assign(context.sandbox.utils.getCurrentNodeJSEndpoint() +
                                '/results.csv' + suffix);
                        }
                    })
                    .error(function(e) {
                        publisher.publishMessage({
                            "messageType": "error",
                            "messageTitle": "CSV Download",
                            "messageText": "Connection to server failed."
                        });
                    });
            });
        }
    };

    function publishCantDownload() {
        publisher.publishMessage({
            "messageType": "warning",
            "messageTitle": "CSV Download",
            "messageText": "No data to download."
        });
    }

    return exposed;

});