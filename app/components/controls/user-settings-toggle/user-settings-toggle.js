define([
    './user-settings-toggle-publisher',
    'bootstrap',
    'bootstrapDialog'
], function (publisher) {
    var context,
        $userSettingsButton;

    var exposed = {
        init: function(thisContext) {
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
                    publisher.closeUserSettings();
                } else {
                    publisher.openUserSettings();
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