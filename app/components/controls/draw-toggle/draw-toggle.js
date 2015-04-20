define([
    './draw-toggle-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        $drawToolButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $drawToolButton = context.$('#drawToggleButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $drawToolButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $drawToolButton.on('click', function(event) {
                event.preventDefault();
                if($drawToolButton.hasClass('active')) {
                    publisher.closeDrawTool();
                } else {
                    publisher.openDrawTool();
                }
            });
        },
        setActive: function() {
            $drawToolButton.addClass('active');
        },
        removeActive: function() {
            $drawToolButton.removeClass('active');
        },
        clear: function() {
            $drawToolButton.removeClass('active');
        }
    };

    return exposed;
});