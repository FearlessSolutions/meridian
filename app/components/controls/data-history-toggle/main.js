define([
    'text!./data-history-toggle.hbs',
    './data-history-toggle',
    './data-history-toggle-mediator',
    'handlebars'
], function (
    dataHistoryToggleHBS,
    dataHistoryToggle,
    dataHistoryToggleMediator
){
    return {
        initialize: function() {
            var dataHistoryToggleTemplate = Handlebars.compile(dataHistoryToggleHBS);
            var html = dataHistoryToggleTemplate();
            this.html(html);

            dataHistoryToggleMediator.init(this);
            dataHistoryToggle.init(this, dataHistoryToggleMediator);
        }
    };

});