define([
    'text!./query-toggle.css',
    'text!./query-toggle.hbs',
    './query-toggle',
    './query-toggle-publisher',
    './query-toggle-subscriber',
    'handlebars'
], function (
    queryToggleCSS,
    queryToggleHBS,
    queryToggle,
    queryTogglePublisher,
    queryToggleSubscriber
){
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(queryToggleCSS, 'controls-query-toggle-component-style');

            var queryToggleTemplate = Handlebars.compile(queryToggleHBS);
            var html = queryToggleTemplate();
            this.html(html);

            queryToggle.init(this);
            queryTogglePublisher.init(this);
            queryToggleSubscriber.init(this);
        }
    };

});