define([
    'text!./user-settings-toggle.hbs',
    './user-settings-toggle',
    './user-settings-toggle-mediator',
    'handlebars'
], function (
    userSettingsToggleHBS,
    userSettingsToggle,
    userSettingsToggleMediator
){
    return {
        initialize: function() {
            var userSettingsToggleTemplate = Handlebars.compile(userSettingsToggleHBS);
            var html = userSettingsToggleTemplate();
            this.html(html);

            userSettingsToggleMediator.init(this);
            userSettingsToggle.init(this, userSettingsToggleMediator);
        }
    };

});