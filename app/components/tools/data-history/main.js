define([
    'text!./data-history.css', 
    'text!./data-history.hbs',
    './data-history',
    './data-history-publisher',
    './data-history-subscriber',
    'handlebars'
], function (
    dataHistoryCSS,
    dataHistoryHBS,
    dataHistory,
    dataHistoryPublisher,
    dataHistorySubscriber
) {
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(dataHistoryCSS, 'tools-data-history-component-style');

            var dataHistoryTemplate = Handlebars.compile(dataHistoryHBS);
            var html = dataHistoryTemplate();
            this.html(html);

            dataHistory.init(this);
            dataHistoryPublisher.init(this);
            dataHistorySubscriber.init(this);
        }
    };
                
});