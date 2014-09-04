define([
    './user-settings',
    './user-settings-publisher',
    './user-settings-subscriber',
    'text!./user-settings.css',
    'text!./user-settings.hbs',
    'handlebars'
], function (userSettings, userSettingsPublisher, userSettingsSubscriber, userSettingsCss, userSettingsHBS) {
    return {
        /**
         * @function initialize
         * @return {type} description
         */
        initialize: function() {
            this.sandbox.utils.addCSS(userSettingsCss, 'displays-user-settings-component-style');

            var userSettingsTemplate = Handlebars.compile(userSettingsHBS);
            /**
             * Set all the values of the template.
             * 'name' There will be a way of knowing which user is using the application. Hard coded for now.
             * 'username' There will be a way of knowing which user is using the application. Hard coded for now.
             */
            var html = userSettingsTemplate({
                "name": "John Smith",
                "username": "jsmith7"
            });
            this.html(html);

            userSettingsSubscriber.init(this);
            userSettingsPublisher.init(this);
            userSettings.init(this);
        }
    };
});