define([
    'spin'
], function (Spinner) {
    var context,
        spinner,
        target,
        opts,
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
                top: '50%', // Top position relative to parent
                left: '50%' // Left position relative to parent
            };
            target = document.getElementsByClassName('spinner')[0];
            spinner = new Spinner(opts).spin(target);
        },
        addToQueue: function() {
            progressQueueCount += 1;
            if(progressQueueCount) {
                spinner = new Spinner(opts).spin(target);
            }
        },
        removeFromQueue: function() {
            progressQueueCount -= 1;
            if(!progressQueueCount) {
                spinner.stop();
            }
        },
        clearQueue: function() {
            progressQueueCount = 0;
            spinner.stop();
        }
    };

    return exposed;
});