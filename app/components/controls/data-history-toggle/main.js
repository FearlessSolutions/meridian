define([
    'text!./data-history-toggle.hbs',
    './data-history-toggle',
    './data-history-toggle-publisher',
    './data-history-toggle-subscriber',
    'handlebars'
], function (
    dataHistoryToggleHBS,
    dataHistoryToggle,
    dataHistoryTogglePublisher,
    dataHistoryToggleSubscriber
){
    return {
        initialize: function() {
            var dataHistoryToggleTemplate = Handlebars.compile(dataHistoryToggleHBS);
            var html = dataHistoryToggleTemplate();
            this.html(html);

            dataHistoryToggle.init(this);
            dataHistoryTogglePublisher.init(this);
            dataHistoryToggleSubscriber.init(this);
        }
    };

});