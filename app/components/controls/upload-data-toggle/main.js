define([
    'text!./data-upload-toggle.hbs',
    './data-upload-toggle',
    './data-upload-toggle-mediator',
    'handlebars'
], function (
    dataToggleHBS,
    dataToggle,
    dataToggleMediator
){
    return {
        initialize: function() {
            var dataToggleTemplate = Handlebars.compile(dataToggleHBS);
            var html = dataToggleTemplate();
            this.html(html);

            dataToggleMediator.init(this);
            dataToggle.init(this, dataToggleMediator);
        }
    };

});