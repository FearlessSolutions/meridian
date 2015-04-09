define([
    'text!./querytype-toggle.css',
    'text!./querytype-toggle.hbs',
    './querytype-toggle',
    './querytype-toggle-publisher',
    './querytype-toggle-subscriber',
    'handlebars'
], function (
    queryTypeToggleCSS,
    queryTypeToggleHBS,
    queryTypeToggle,
    queryTypeTogglePublisher,
    queryTypeToggleSubscriber
){
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(queryTypeToggleCSS, 'controls-querytype-toggle-component-style');

            var queryTypeToggleTemplate = Handlebars.compile(queryTypeToggleHBS);
            var html = queryTypeToggleTemplate();
            this.html(html);

            queryTypeToggle.init(this);
            queryTypeTogglePublisher.init(this);
            queryTypeToggleSubscriber.init(this);
        }
    };

});