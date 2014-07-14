define([
    './clear-toggle-publisher',
    'bootstrap'
], function (publisher) {

    var context,
        $toggleButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $toggleButton = context.$('#clear-toggle');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $toggleButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $toggleButton.on('click', function(event){
                publisher.publishOpenClearDialog();
            });
        }
    };

    return exposed;

});