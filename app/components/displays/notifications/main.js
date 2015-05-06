define([
    'text!./notifications.css',
    './notifications',
    './notifications-mediator',
], function (
    notificationMessagingCSS, 
    notificationMessaging, 
    notificationMessagingMediator
) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(notificationMessagingCSS, 'displays-notifications-component-style');

            notificationMessagingMediator.init(this);
            notificationMessaging.init(this, notificationMessagingMediator);
        }
    };
                
});
