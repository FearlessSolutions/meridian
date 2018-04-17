define([
    './user-settings',
    './user-settings-mediator',
    'text!./user-settings.css',
    'text!./user-settings.hbs',
    'handlebars'
], function (
    userSettings, 
    userSettingsMediator, 
    userSettingsCss, 
    userSettingsHBS,
    Handlebars
) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(userSettingsCss, 'displays-user-settings-component-style');

            var userSettingsTemplate = Handlebars.compile(userSettingsHBS);
            
            var html = userSettingsTemplate({
                "name": "John Smith",
                "username": "jsmith7"
            });
            this.html(html);

            userSettingsMediator.init(this);
            userSettings.init(this, userSettingsMediator);
        }
    };
});