define([
    './bookmark-toggle-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        $bookmarkButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $bookmarkButton = context.$('#bookmarkToggleButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $bookmarkButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $bookmarkButton.on('click', function(event) {
                event.preventDefault();
                if($bookmarkButton.hasClass('active')) {
                    publisher.closeBookmark();
                } else {
                    publisher.openBookmark();
                }
            });
        },
        setActive: function() {
            $bookmarkButton.addClass('active');
        },
        removeActive: function() {
            $bookmarkButton.removeClass('active');
        },
        clear: function() {
            $bookmarkButton.removeClass('active');
        }
    };

    return exposed;
});