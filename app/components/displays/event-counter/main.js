define([
    'text!./event-counter.css', 
    'text!./event-counter.hbs',
    './event-counter',
    './event-counter-subscriber',
    'handlebars'
], function (eventCountToolCSS, eventCountToolHBS, eventCountTool, eventCountToolSubscriber) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(eventCountToolCSS, 'display-event-counter-component-style');

            var eventCountToolTemplate = Handlebars.compile(eventCountToolHBS);
            var html = eventCountToolTemplate();
            this.html(html);

            eventCountTool.init(this);
            eventCountToolSubscriber.init(this);
        }
    };
                
});