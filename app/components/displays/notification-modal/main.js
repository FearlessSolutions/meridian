define([
    'text!./notification-modal.css',
    'text!./notification-modal.hbs',
    './notification-modal',
    './notification-modal-subscriber',
    './notification-modal-publisher',
    'handlebars'
], function (notificationCSS, notificationHBS, notification, notificationSubscriber, notificationPublisher) {

    return {
        initialize: function() {
            var notificationTemplate = Handlebars.compile(notificationHBS),
                notificationHTML = notificationTemplate();

            this.sandbox.utils.addCSS(notificationCSS, 'displays-notification-modal-component-style');

            this.html(notificationHTML);

            notificationPublisher.init(this);
            notification.init(this);
            notificationSubscriber.init(this);
        }
    };
                
});
