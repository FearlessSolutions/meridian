define([
    'text!./support-toggle.css',
    'text!./support-toggle.hbs',
    './support-toggle',
    './support-toggle-publisher',
    './support-toggle-subscriber',
    'handlebars'
], function (
    supportToggleCSS,
    supportToggleHBS,
    supportToggle,
    supportTogglePublisher,
    supportToggleSubscriber
){
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(supportToggleCSS, 'controls-support-toggle-component-style');

            var supportToggleTemplate = Handlebars.compile(supportToggleHBS);
            var html = supportToggleTemplate({
                "appName": this.sandbox.systemConfiguration.appName
            });
            this.html(html);

            supportToggle.init(this);
            supportTogglePublisher.init(this);
            supportToggleSubscriber.init(this);
        }
    };

});