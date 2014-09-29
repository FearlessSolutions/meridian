define([
    'text!./user-settings-toggle.css',
    'text!./user-settings-toggle.hbs',
    './user-settings-toggle',
    './user-settings-toggle-publisher',
    './user-settings-toggle-subscriber',
    'handlebars'
], function (
    userSettingsToggleCSS,
    userSettingsToggleHBS,
    userSettingsToggle,
    userSettingsTogglePublisher,
    userSettingsToggleSubscriber
){
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(userSettingsToggleCSS, 'controls-user-settings-toggle-component-style');

            var userSettingsToggleTemplate = Handlebars.compile(userSettingsToggleHBS);
            var html = userSettingsToggleTemplate();
            this.html(html);

            userSettingsToggle.init(this);
            userSettingsTogglePublisher.init(this);
            userSettingsToggleSubscriber.init(this);
        }
    };

});