define([
    './data-history-toggle-publisher',
    'bootstrap',
    'bootstrapDialog'
], function (publisher) {
    var context,
        $dataHistoryButton;

    var exposed = {
        init: function(thisContext) {
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
                    publisher.closeDataHistory();
                } else {
                    publisher.openDataHistory();
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