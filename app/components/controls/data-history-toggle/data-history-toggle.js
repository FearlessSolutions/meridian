define([
    'bootstrap'
], function () {
    var context,
        $dataHistoryButton;

    var exposed = {
        init: function(thisContext, mediator) {
            context = thisContext;
            $dataHistoryButton = context.$('#dataHistoryToggleButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $dataHistoryButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $dataHistoryButton.on('click', function(event) {
                event.preventDefault();
                if($dataHistoryButton.hasClass('active')) {
                    mediator.closeDataHistory();
                } else {
                    mediator.openDataHistory();
                }
            });
        },
        setActive: function() {
            $dataHistoryButton.addClass('active');
        },
        removeActive: function() {
            $dataHistoryButton.removeClass('active');
        },
        clear: function() {
            $dataHistoryButton.removeClass('active');
        }
    };

    return exposed;
});