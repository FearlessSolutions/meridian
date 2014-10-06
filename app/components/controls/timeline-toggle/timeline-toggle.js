define([
    './timeline-toggle-publisher',
    'bootstrap',
    'bootstrapDialog'
], function (publisher) {
    var context,
        $timelineButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $timelineButton = context.$('#timelineToggleButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $timelineButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $timelineButton.on('click', function(event) {
                event.preventDefault();
                if($timelineButton.hasClass('active')) {
                    publisher.closeTimeline();
                } else {
                    publisher.openTimeline();
                }
            });
        },
        setActive: function() {
            $timelineButton.addClass('active');
        },
        removeActive: function() {
            $timelineButton.removeClass('active');
        },
        clear: function() {
            $timelineButton.removeClass('active');
        }
    };

    return exposed;
});