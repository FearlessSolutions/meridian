define([
    'bootstrap'
], function () {
    var context,
        $queryToolButton;

    var exposed = {
        init: function(thisContext, mediator) {
            context = thisContext;
            $queryToolButton = context.$('#queryToggleButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $queryToolButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $queryToolButton.on('click', function(event) {
                event.preventDefault();
                if($queryToolButton.hasClass('active')) {
                    mediator.closeQueryTool();
                } else {
                    mediator.openQueryTool();
                }
            });
        },
        setActive: function() {
            $queryToolButton.addClass('active');
        },
        removeActive: function() {
            $queryToolButton.removeClass('active');
        },
        clear: function() {
            $queryToolButton.removeClass('active');
        }
    };

    return exposed;
});