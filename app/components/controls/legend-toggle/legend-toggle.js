define([
    './legend-toggle-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        $legendToggleButton;

    var exposed = {
        init: function(thisContext) {
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
                    publisher.hideLegend();
                    exposed.removeActiveClass();
                } else {
                    publisher.showLegend();
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