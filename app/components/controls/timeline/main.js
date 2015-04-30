define([
    'text!./timeline.css', 
    'text!./timeline.hbs',
    './timeline',
    './timeline-mediator',
    'handlebars'
], function (
    timelineCSS, 
    timelineHBS, 
    timeline, 
    timelineMediator
) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(timelineCSS, 'control-timeline-component-style');

            var timelineTemplate = Handlebars.compile(timelineHBS);
            var html = timelineTemplate();
            this.html(html);

            timelineMediator.init(this);
            timeline.init(this, timelineMediator);
            
        }
    };
                
});