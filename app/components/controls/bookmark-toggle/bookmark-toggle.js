define([
    'bootstrap'
], function () {
    var context,
        mediator,
        $bookmarkButton;

    var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;
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
                    mediator.closeBookmark();
                } else {
                    mediator.openBookmark();
                }
            });
        },
        setActive: function() {
            $bookmarkButton.addClass('active');
        },
        removeActive: function() {
            $bookmarkButton.removeClass('active');
        }
    };

    return exposed;
});