define([
    'text!./progress-notification.css',
    'text!./progress-notification.hbs',
    './progress-notification',
    './progress-notification-mediator',
    'handlebars'
], function (
    progressNotificationCSS,
    progressNotificationHBS,
    progressNotification,
    progressNotificationMediator
){
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(progressNotificationCSS, 'display-progress-notification-component-style');

            var progressNotificationTemplate = Handlebars.compile(progressNotificationHBS);
            var html = progressNotificationTemplate();
            this.html(html);

            progressNotificationMediator.init(this);
            progressNotification.init(this, progressNotificationMediator);
        }
    };
});