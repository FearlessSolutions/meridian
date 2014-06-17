define([
    'text!./notifications.css',
    './notifications',
    './notifications-subscriber',
], function (notificationMessagingCSS, notificationMessaging, notificationMessagingSubscriber) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(notificationMessagingCSS, 'displays-notifications-component-style');

            notificationMessaging.init(this);
            notificationMessagingSubscriber.init(this);
        }
    };
                
});
