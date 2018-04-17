define([
    'text!./visual-mode-toggle-notification.hbs',
    'handlebars',
    'bootstrap'
], function (notificationHBS, Handlebars) {
    var context,
        mediator,
        targetVisualMode,
        currentVisualMode,
        $target,
        userNotified,
        notificationTemplate,
        MAX_VISIBLE = 5000,
        CONTROL_DESIGNATION = 'visual-mode-toggle';

    var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;
            notificationTemplate = Handlebars.compile(notificationHBS);

            // Setting the current visual mode locally and in state manager from the config
            currentVisualMode = context.options.default || context.sandbox.mapConfiguration.defaultVisualMode;
            context.sandbox.stateManager.map.visualMode = context.sandbox.mapConfiguration.defaultVisualMode;
            context.$('#visual-mode-toggle-container [data-visual-mode="' + currentVisualMode + '"]').addClass('active');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            context.$('#cluster-toggle-btn').tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });
            context.$('#feature-toggle-btn').tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });
            context.$('#heatmap-toggle-btn').tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

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
                    mediator.publishMessage({
                        "messageType": "warning",
                        "messageTitle": "Visual Mode",
                        "messageText": "Unsafe to view in individual feature mode"
                    });    
                }
            } else {
                mediator.publishNotification({
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
            mediator.setVisualMode({'mode': targetVisualMode});
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