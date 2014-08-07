define([
    'text!./legend-toggle.hbs',
    './legend-toggle',
    './legend-toggle-publisher',
    './legend-toggle-subscriber',
    'handlebars'
], function (
    legendToggleHBS,
    legendToggle,
    legendTogglePublisher,
    legendToggleSubscriber
){
    return {
        initialize: function() {
            var legendToggleTemplate = Handlebars.compile(legendToggleHBS);
            var html = legendToggleTemplate();
            this.html(html);

            legendToggle.init(this);
            legendTogglePublisher.init(this);
            legendToggleSubscriber.init(this);
        }
    };

});