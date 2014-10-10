define([
    'text!./data-history-toggle.css',
    'text!./data-history-toggle.hbs',
    './data-history-toggle',
    './data-history-toggle-publisher',
    './data-history-toggle-subscriber',
    'handlebars'
], function (
    dataHistoryToggleCSS,
    dataHistoryToggleHBS,
    dataHistoryToggle,
    dataHistoryTogglePublisher,
    dataHistoryToggleSubscriber
){
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(dataHistoryToggleCSS, 'controls-data-history-toggle-component-style');

            var dataHistoryToggleTemplate = Handlebars.compile(dataHistoryToggleHBS);
            var html = dataHistoryToggleTemplate();
            this.html(html);

            dataHistoryToggle.init(this);
            dataHistoryTogglePublisher.init(this);
            dataHistoryToggleSubscriber.init(this);
        }
    };

});