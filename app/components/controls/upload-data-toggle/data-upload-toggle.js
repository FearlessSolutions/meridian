define([
    'bootstrap'
], function () {
    var context,
        $toggleButton;

    var exposed = {
        init: function(thisContext, mediator) {
            context = thisContext;
            $toggleButton = context.$('#dataUploadToggleButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $toggleButton.tooltip({
                container: 'body',
                delay: {
                    show: 500
                }
            });

            $toggleButton.on('click', function(event) {
                event.preventDefault();
                if($toggleButton.hasClass('active')) {
                    mediator.hideLegend();
                    exposed.removeActiveClass();
                } else {
                    mediator.showLegend();
                    exposed.addActiveClass();
                }
            });

        },
        addActiveClass: function() {
            $toggleButton.addClass('active');
        },
        removeActiveClass: function() {
            $toggleButton.removeClass('active');
        }
    };

    return exposed;
});