define([
    'text!./history-log.css', 
    'text!./history-log.hbs',
    './history-log',
    './history-log-subscriber',
    'handlebars'
], function (historyLogCSS, historyLogHBS, historyLog, historyLogSubscriber) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(historyLogCSS, 'display-history-log-component-style');

            var historyLogTemplate = Handlebars.compile(historyLogHBS);
            var html = historyLogTemplate();
            this.html(html);

            historyLog.init(this);
            historyLogSubscriber.init(this);
        }
    };
                
});