define([
    'text!./progress-notification.css',
    'text!./progress-notification.hbs',
    './progress-notification',
    './progress-notification-subscriber',
    'handlebars'
], function (
    progressNotificationCSS,
    progressNotificationHBS,
    progressNotification,
    progressNotificationSubscriber
){
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(progressNotificationCSS, 'display-progress-notification-component-style');

            var progressNotificationTemplate = Handlebars.compile(progressNotificationHBS);
            var html = progressNotificationTemplate();
            this.html(html);

            progressNotification.init(this);
            progressNotificationSubscriber.init(this);
        }
    };

});