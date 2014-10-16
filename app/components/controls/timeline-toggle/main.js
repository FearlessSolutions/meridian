define([
    'text!./timeline-toggle.css',
    'text!./timeline-toggle.hbs',
    './timeline-toggle',
    './timeline-toggle-publisher',
    './timeline-toggle-subscriber',
    'handlebars'
], function (
    timelineToggleCSS,
    timelineToggleHBS,
    timelineToggle,
    timelineTogglePublisher,
    timelineToggleSubscriber
){
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(timelineToggleCSS, 'controls-timeline-toggle-component-style');

            var timelineToggleTemplate = Handlebars.compile(timelineToggleHBS);
            var html = timelineToggleTemplate({
                "appName": this.sandbox.systemConfiguration.appName
            });
            this.html(html);

            timelineToggle.init(this);
            timelineTogglePublisher.init(this);
            timelineToggleSubscriber.init(this);
        }
    };

});