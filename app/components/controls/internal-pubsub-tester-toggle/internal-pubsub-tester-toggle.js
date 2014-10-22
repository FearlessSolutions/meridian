define([
    './internal-pubsub-tester-toggle-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        $internalPubsubTesterToggleButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $internalPubsubTesterToggleButton = context.$('#internalPubsubTesterToggleButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $internalPubsubTesterToggleButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $internalPubsubTesterToggleButton.on('click', function(event) {
                event.preventDefault();
                if($internalPubsubTesterToggleButton.hasClass('active')) {
                    publisher.hideLegend();
                    exposed.removeActiveClass();
                } else {
                    publisher.showLegend();
                    exposed.addActiveClass();
                }
            });

        },
        addActiveClass: function() {
            $internalPubsubTesterToggleButton.addClass('active');
        },
        removeActiveClass: function() {
            $internalPubsubTesterToggleButton.removeClass('active');
        }
    };

    return exposed;
});