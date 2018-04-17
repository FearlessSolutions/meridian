define([
    'text!./event-counter.css', 
    'text!./event-counter.hbs',
    './event-counter',
    './event-counter-mediator',
    'handlebars'
], function (
    eventCountToolCSS, 
    eventCountToolHBS, 
    eventCountTool, 
    eventCountToolMediator,
    Handlebars
){

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(eventCountToolCSS, 'display-event-counter-component-style');

            var eventCountToolTemplate = Handlebars.compile(eventCountToolHBS);
            var html = eventCountToolTemplate();
            this.html(html);

            eventCountToolMediator.init(this);
            eventCountTool.init(this, eventCountToolMediator);
        }
    };
                
});