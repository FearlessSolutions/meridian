define([
    'text!./datagrid-toggle.hbs',
    './datagrid-toggle',
    './datagrid-toggle-mediator',
    'handlebars'
], function (
    datagridToggleHBS,
    datagridToggle,
    datagridToggleMediator,
    Handlebars
){
    return {
        initialize: function() {
            var datagridToggleTemplate = Handlebars.compile(datagridToggleHBS);
            var html = datagridToggleTemplate();
            this.html(html);

            datagridToggleMediator.init(this);
            datagridToggle.init(this, datagridToggleMediator);
        }
    };

});