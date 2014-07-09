define([
    './internal-pubsub-tester-config',
    'bootstrap',
    'bootstrapDialog',
    'handlebars',
    'jqueryUI',
    'select2'
], function (internalPubSubTesterConfig) {
    var context,
        currentSubscriptions = [];

    var exposed = {
        
        init:function(thisContext) {
            context = thisContext;

            context.$('#internalPubsubTesterToggleButton').on('click', function(event) {
                event.preventDefault();
                context.$('#internalPubsubTesterDialog').dialog('toggle');
            });

            // listen to the button click for publishig message
            context.$('#internalPubsubTesterDialog #publish').on('click', function(event) {
                event.preventDefault();
                // if option is not disabled, fire publisher...
                if(context.$('#internal-pub-channel option:selected').attr('disabled') !== 'disabled') {
                    exposed.publishMessage();
                }
            });

            context.$('#internalPubsubTesterDialog #subscribe').on('click', function(event) {
                var channels = [];

                event.preventDefault();

                context.$('.subscription-list input[type="checkbox"]:checked').each(function(key, value) {
                    channels.push(context.$(this).attr('channel'));
                });
                
                exposed.updateSubscriptions(channels);
            });

            context.$('#internalPubsubTesterDialog .dropdown-menu').on('click', function(e) {
                if(context.$(this).hasClass('dropdown-menu-form')) {
                    // stop propagation that would cause the dropdown menu to close after one option is clicked
                    e.stopPropagation();
                }
            });

            // make dialog draggable
            context.$("#internalPubsubTesterDialog").draggable({ handle: ".dialog-header" });

            // get sample payload when user picks channel form select list
            context.$('#internal-pub-channel').on('change', function() {
                var channelValue = context.$('#internal-pub-channel').val(),
                    payloadValue = JSON.stringify(internalPubSubTesterConfig[channelValue].payload, null, "  ");

                context.$('#internal-pub-message').val(payloadValue);
            });

            context.$('#clear-log-button')
                .tooltip()
                .on('click', function(e) {
                    exposed.clearLogOutput();
                }
            );

            context.$('#accordion').collapse({
              toggle: false
            });

            context.$("#internal-pub-channel").select2({
                placeholder: "Select a Channel"
            });
        },
        publishMessage: function() {
            var channelValue = context.$('#internal-pub-channel').val(),
                payloadValue = context.$('#internal-pub-message').val(),
                params = context.sandbox.utils.parseJSON(payloadValue);
                params.channel = channelValue;

            context.sandbox.emit(channelValue, params);
        },
        updateSubscriptions: function(params) {

            // Clear subscribers so dublicates aren't added
            context.sandbox.utils.each(currentSubscriptions, function(key, value) {
                context.sandbox.off(value, exposed.displayMessage);
            });

            // Clear array of subcriptions
            currentSubscriptions = [];

            // Update subsciption settings to listen to the provided channels and log out to the textarea
            context.sandbox.utils.each(params, function(key, value) {
                context.sandbox.on(value, exposed.displayMessage);
                currentSubscriptions.push(value);
            });
        },
        displayMessage: function(params) {
            var payload,
                date = new Date();

            var options = {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            };
            var formattedDate = date.toLocaleTimeString("en-us", options);
            if(!params) {
                payload = "Undefined/Empty Payload Value";
            } else {
                payload = JSON.stringify(params, null, "  ");
            }
            context.$('#internal-sub-message').prepend('<p><span class="date-time-stamp">' + formattedDate + '</span><br>' + payload + '</p><hr>');
        },
        clearLogOutput: function() {
            context.$('#internal-sub-message').html('');
        }
    };

    return exposed;
});