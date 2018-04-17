define([
    'text!./data-history.css', 
    'text!./data-history.hbs',
    './data-history',
    './data-history-mediator',
    'handlebars'
], function (
    dataHistoryCSS,
    dataHistoryHBS,
    dataHistory,
    dataHistoryMediator,
    Handlebars
) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(dataHistoryCSS, 'tools-data-history-component-style');

            var dataHistoryTemplate = Handlebars.compile(dataHistoryHBS);
            var html = dataHistoryTemplate();
            this.html(html);

            dataHistory.init(this, dataHistoryMediator);
            dataHistoryMediator.init(this);
        }
    };
                
});