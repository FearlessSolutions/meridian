define([
], function () {
    var context,
        $progressNotificationSpinner,
        progressQueueCount = 0;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $progressNotificationSpinner = context.$('.spinner');
        },
        addToQueue: function() {
            progressQueueCount += 1;
            if(progressQueueCount) {
                $progressNotificationSpinner.addClass('active');
            }
        },
        removeFromQueue: function() {
            progressQueueCount -= 1;
            if(!progressQueueCount) {
                $progressNotificationSpinner.removeClass('active');
            }
        },
        clearQueue: function() {
            progressQueueCount = 0;
            $progressNotificationSpinner.removeClass('active');
        }
    };

    return exposed;
});