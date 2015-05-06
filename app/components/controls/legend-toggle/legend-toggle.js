define([
    'bootstrap'
], function () {
    var context,
        $legendToggleButton;

    var exposed = {
        init: function(thisContext, mediator) {
            context = thisContext;
            $legendToggleButton = context.$('#legendToggleButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $legendToggleButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $legendToggleButton.on('click', function(event) {
                event.preventDefault();
                if($legendToggleButton.hasClass('active')) {
                    mediator.hideLegend();
                    exposed.removeActiveClass();
                } else {
                    mediator.showLegend();
                    exposed.addActiveClass();
                }
            });

        },
        addActiveClass: function() {
            $legendToggleButton.addClass('active');
        },
        removeActiveClass: function() {
            $legendToggleButton.removeClass('active');
        }
    };

    return exposed;
});