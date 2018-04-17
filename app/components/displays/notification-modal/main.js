define([
    'text!./notification-modal.css',
    'text!./notification-modal.hbs',
    './notification-modal',
    './notification-modal-mediator',
    'handlebars'
], function (
    notificationCSS, 
    notificationHBS, 
    notification, 
    notificationMediator,
    Handlebars
) {

    return {
        initialize: function() {
            var notificationTemplate = Handlebars.compile(notificationHBS),
                notificationHTML = notificationTemplate();

            this.sandbox.utils.addCSS(notificationCSS, 'displays-notification-modal-component-style');

            this.html(notificationHTML);

            notificationMediator.init(this);
            notification.init(this, notificationMediator);
        }
    };
                
});
