define([
    'text!./datagrid-toggle.hbs',
    './datagrid-toggle',
    './datagrid-toggle-publisher',
    './datagrid-toggle-subscriber',
    'handlebars'
], function (
    datagridToggleHBS,
    datagridToggle,
    datagridTogglePublisher,
    datagridToggleSubscriber
){
    return {
        initialize: function() {
            var datagridToggleTemplate = Handlebars.compile(datagridToggleHBS);
            var html = datagridToggleTemplate();
            this.html(html);

            datagridToggle.init(this);
            datagridTogglePublisher.init(this);
            datagridToggleSubscriber.init(this);
        }
    };

});