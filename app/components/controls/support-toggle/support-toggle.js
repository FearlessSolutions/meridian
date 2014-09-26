define([
    './support-toggle-publisher',
    'bootstrap',
    'bootstrapDialog'
], function (publisher) {
    var context,
        $supportButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $supportButton = context.$('#supportToggleButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $supportButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $supportButton.on('click', function(event) {
                event.preventDefault();
                if($supportButton.hasClass('active')) {
                    publisher.closeSupport();
                } else {
                    publisher.openSupport();
                }
            });
        },
        setActive: function() {
            $supportButton.addClass('active');
        },
        removeActive: function() {
            $supportButton.removeClass('active');
        },
        clear: function() {
            $supportButton.removeClass('active');
        }
    };

    return exposed;
});