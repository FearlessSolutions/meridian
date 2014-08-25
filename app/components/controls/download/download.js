define([
    './download-publisher',
    'bootstrap'
], function(publisher){

    var context,
        $downloadButton;

    var exposed = {
        init: function(thisContext){
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

            $downloadButton.on('click', function(event){
                event.preventDefault();

                //If it is not selectable, ignore click
                if($downloadButton.hasClass('stop') || $downloadButton.hasClass('wait')){
                    return;
                }

                publisher.publishMessage({
                    "messageType": "success",
                    "messageTitle": "CSV Download",
                    "messageText": "CSV Download started."
                });
                window.open(context.sandbox.utils.getCurrentNodeJSEndpoint() + '/results.csv?x-meridian-session-id=' + context.sandbox.sessionId);
            });

            //Handle turning off download button if there is no data
            //Asks the server for the number of features in this session
            // disables when 0
            applyFailedCSS();//Starts turned off
            $downloadButton.hover(function(event){
                applyCheckingCSS();

                context.sandbox.utils.ajax({
                    "type": "GET" ,
                    "url": context.sandbox.utils.getCurrentNodeJSEndpoint() + "/getCount",
                    "cache": false
                })
                    .done(function(response){
                        if(response.count === 0){ //No points = fail
                            applyFailedCSS();
                        }else{
                            applyPassedCSS();
                        }
                    })
                    .error(function(e){
                        applyFailedCSS();
                        publisher.publishMessage({
                            "messageType": "error",
                            "messageTitle": "CSV Download",
                            "messageText": "Connection to server failed."
                        });
                    });
            });
        },
        /**
         * On clear, there is no data, so disable
         */
        "clear": function(){
            applyFailedCSS()
        }
    };

    /**
     * Apply css while waiting for server response
     */
    function applyCheckingCSS(){
        $downloadButton.removeClass('stop');
        $downloadButton.addClass('wait');
    }

    /**
     * Apply css after server check passes
     */
    function applyPassedCSS(){
        $downloadButton.removeClass('wait');
        $downloadButton.removeClass('stop');
    }

    /**
     * Apply css after server check failed
     */
    function applyFailedCSS(){
        $downloadButton.addClass('stop');
        $downloadButton.removeClass('wait');
    }

    return exposed;

});