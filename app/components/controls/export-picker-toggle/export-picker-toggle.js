define([
    './export-picker-toggle-publisher',
    'bootstrap'
], function(publisher){

    var context,
        $button;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $button = context.$('#export-picker-toggle');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $button.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $button.on('click', function(event) {
                event.preventDefault();
                if($button.hasClass('active')) {
                    publisher.closeModal();
                } else {
                    publisher.openModal();
                }
            });
        },
        setActive: function() {
            $button.addClass('active');
        },
        removeActive: function() {
            $button.removeClass('active');
        },
        clear: function() {
            exposed.removeActive();
        }

    };

    return exposed;

});