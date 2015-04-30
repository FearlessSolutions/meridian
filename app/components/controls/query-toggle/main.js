define([
    'text!./query-toggle.hbs',
    './query-toggle',
    './query-toggle-mediator',
    'handlebars'
], function (
    queryToggleHBS,
    queryToggle,
    queryToggleMediator
){
    return {
        initialize: function() {
            var queryToggleTemplate = Handlebars.compile(queryToggleHBS);
            var html = queryToggleTemplate();
            this.html(html);

            queryToggleMediator.init(this);
            queryToggle.init(this, queryToggleMediator);
        }
    };

});