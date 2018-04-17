define([
    'text!./support-toggle.hbs',
    './support-toggle',
    './support-toggle-mediator',
    'handlebars'
], function (
    supportToggleHBS,
    supportToggle,
    supportToggleMediator,
    Handlebars
){
    return {
        initialize: function() {
            var supportToggleTemplate = Handlebars.compile(supportToggleHBS);
            var html = supportToggleTemplate({
                "appName": this.sandbox.systemConfiguration.appName
            });
            this.html(html);

            supportToggleMediator.init(this);
            supportToggle.init(this, supportToggleMediator);
        }
    };

});