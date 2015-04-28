define([
    './clear-toggle-mediator',
    'bootstrap'
], function () {

    var context,
        $toggleButton;

    var exposed = {
        init: function(thisContext, mediator) {
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
                mediator.openClearDialog();
            });
        }
    };

    return exposed;

});