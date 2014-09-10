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