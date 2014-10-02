define([
    'spin'
], function (Spinner) {
    var context,
        spinner,
        target,
        opts,
        $progressSpinner;
        progressQueueCount = 0;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;

            opts = {
                lines: 30, // The number of lines to draw
                length: 2, // The length of each line
                width: 3, // The line thickness
                radius: 3, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#428bca', // #rgb or #rrggbb or array of colors
                speed: 0.75, // Rounds per second
                trail: 30, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                // top: '16px', // Top position relative to parent
                // left: '-40px' // Left position relative to parent
                top: '', // Top position relative to parent
                left: '' // Left position relative to parent
            };
            $progressSpinner = context.$('.spinner-container');
            target = document.getElementsByClassName('spinner-container')[0];
            spinner = new Spinner(opts).spin(target);
        },
        addToQueue: function() {
            console.debug($progressSpinner.html());
            progressQueueCount += 1;
            if(progressQueueCount) {
                $progressSpinner.addClass('active');
            }
        },
        removeFromQueue: function() {
            progressQueueCount -= 1;
            if(!progressQueueCount) {
                $progressSpinner.removeClass('active');
            }
        },
        clearQueue: function() {
            progressQueueCount = 0;
            $progressSpinner.removeClass('active');
        }
    };

    return exposed;
});