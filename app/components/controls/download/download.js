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

                if(context.sandbox.dataStorage.datasets.length === 0){
                    publishCantDownload();
                    return;
                }

                //Not adding to ajaxHandler, because it would then have to handle clear, and we don't have a good way around that.
                context.sandbox.utils.ajax({
                    "type": "GET" ,
                    "url": context.sandbox.utils.getCurrentNodeJSEndpoint() + "/getCount",
                    "cache": false
                })
                    .done(function(response) {
                        var currentDatasetIds = [];

                        if(response.count === 0){ //No points = fail
                            publishCantDownload();
                        }else{
                            publisher.publishMessage({
                                "messageType": "success",
                                "messageTitle": "CSV Download",
                                "messageText": "CSV Download started."
                            });

                            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(datasetId, dataset) {
                                currentDatasetIds.push(datasetId);
                            });

                            var currentDatasetIdsString = currentDatasetIds.join();
                            console.debug(currentDatasetIdsString);

                            //old /results.csv?x-meridian-session-id=ericsmom
                            //new /results.csv?x-meridian-session-id=ericsmom&ids=id1,id2,id3,id4
                            window.location.assign(context.sandbox.utils.getCurrentNodeJSEndpoint() + 
                                '/results.csv?x-meridian-session-id=' + 
                                context.sandbox.sessionId + 
                                '&ids=' +
                                currentDatasetIdsString);
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