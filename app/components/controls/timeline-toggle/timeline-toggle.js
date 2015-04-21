define([
    'bootstrap'
], function () {
    var context,
        $timelineButton;

    var exposed = {
        init: function(thisContext, mediator) {
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
                    mediator.closeTimeline();
                } else {
                    mediator.openTimeline();
                }
            });
            
        },
        setActive: function() {
            if(!context.sandbox.utils.isEmptyObject(context.sandbox.dataStorage.datasets)) {
                $timelineButton.addClass('active');
            } else {
                mediator.publishMessage({
                    "messageType": "warning",
                    "messageTitle": "Timeline",
                    "messageText": "No data to display in timeline."
                });
            }
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