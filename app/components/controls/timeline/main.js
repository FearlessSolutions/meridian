define([
    'text!./timeline.css', 
    'text!./timeline.hbs',
    './timeline',
    './timeline-publisher',
    './timeline-subscriber',
    'handlebars'
], function (timelineCSS, timelineHBS, timeline, timelinePublisher, timelineSubscriber) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(timelineCSS, 'control-timeline-component-style');

            var timelineTemplate = Handlebars.compile(timelineHBS);
            var html = timelineTemplate();
            this.html(html);

            timelinePublisher.init(this);
            timeline.init(this);
            timelineSubscriber.init(this);
        }
    };
                
});