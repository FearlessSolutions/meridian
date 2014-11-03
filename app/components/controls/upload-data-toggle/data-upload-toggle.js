define([
    './data-upload-toggle-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        $toggleButton;

    var exposed = {
        init: function(thisContext) {
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
                    publisher.hideLegend();
                    exposed.removeActiveClass();
                } else {
                    publisher.showLegend();
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