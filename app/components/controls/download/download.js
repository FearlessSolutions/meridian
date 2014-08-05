define([
    'bootstrap'
], function(){

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
                window.open(context.sandbox.utils.getCurrentNodeJSEndpoint() + '/results.csv?x-meridian-session-id=' + context.sandbox.sessionId);
            });
        }
    };

    return exposed;

});