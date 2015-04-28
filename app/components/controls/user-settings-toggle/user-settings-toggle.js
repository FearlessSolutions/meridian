define([
    'bootstrap'
], function () {
    var context,
        $userSettingsButton;

    var exposed = {
        init: function(thisContext, mediator) {
            context = thisContext;
            $userSettingsButton = context.$('#userSettingsToggleButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $userSettingsButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $userSettingsButton.on('click', function(event) {
                event.preventDefault();
                if($userSettingsButton.hasClass('active')) {
                    mediator.closeUserSettings();
                } else {
                    mediator.openUserSettings();
                }
            });
        },
        setActive: function() {
            $userSettingsButton.addClass('active');
        },
        removeActive: function() {
            $userSettingsButton.removeClass('active');
        },
        clear: function() {
            $userSettingsButton.removeClass('active');
        }
    };

    return exposed;
});