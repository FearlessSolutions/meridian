define([
    'text!./visual-mode-toggle-notification.hbs',
    './visual-mode-toggle-publisher',
    'bootstrap'
], function (notificationHBS, publisher) {
    var context,
        targetVisualMode,
        currentVisualMode,
        $target,
        userNotified,
        notificationTemplate,
        MAX_VISIBLE = 5000,
        CONTROL_DESIGNATION = 'visual-mode-toggle';

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            notificationTemplate = Handlebars.compile(notificationHBS);

            // Setting the current visual mode locally and in state manager from the config
            currentVisualMode = context.options.default || context.sandbox.mapConfiguration.defaultVisualMode;
            context.sandbox.stateManager.map.visualMode = context.sandbox.mapConfiguration.defaultVisualMode;
            context.$('#visual-mode-toggle-container [data-visual-mode="' + currentVisualMode + '"]').addClass('active');

            context.$('#visual-mode-toggle-container .btn').on('click', function() {
                $target = context.$(this);
                targetVisualMode = $target.attr('data-visual-mode');

                if(!$target.hasClass('active')) {
                    if(targetVisualMode === 'feature') {
                        exposed.confirmFeatureMode();
                    } else {
                        exposed.setVisualMode();
                    }
                }
            });

        },
        confirmFeatureMode: function() {
            if(userNotified) {
                exposed.setVisualMode();

                if(countVisiblePoints() > MAX_VISIBLE) {
                    publisher.publishMessage({
                        "messageType": "warning",
                        "messageTitle": "Visual Mode",
                        "messageText": "Unsafe to view in individual feature mode"
                    });    
                }
            } else {
                publisher.publishNotification({
                    "origin": CONTROL_DESIGNATION,
                    "body": notificationTemplate()
                });
            }
        },
        setFeatureMode: function(params) {
            if(params.origin !== CONTROL_DESIGNATION) {
                return;
            }
            userNotified = true;
            exposed.confirmFeatureMode();
        },
        setVisualMode: function() {
            $target.parent().children('.btn').removeClass('active');
            $target.addClass('active');
            $target.attr('data-visual-mode');
            context.sandbox.stateManager.map.visualMode = targetVisualMode;
            publisher.setVisualMode({'mode': targetVisualMode});
            currentVisualMode = targetVisualMode;
        },
        clear: function() {
            // Setting the current visual mode locally and in state manager from the config
            // currentVisualMode = context.sandbox.mapConfiguration.defaultVisualMode;
            // context.sandbox.stateManager.map.visualMode = context.sandbox.mapConfiguration.defaultVisualMode;
            // context.$('#visual-mode-toggle-container').children('.btn').removeClass('active');
            // context.$('#visual-mode-toggle-container [data-visual-mode="' + currentVisualMode + '"]').addClass('active');
        }
    };

    function countVisiblePoints() {
        var count = 0;
        context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, value) {
            if(value.visible === true) {
                count += value.models.length;
            }
        });
        
        return count;
    }

    return exposed;
});