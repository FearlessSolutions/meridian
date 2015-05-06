define([
    'text!./timeline-toggle.hbs',
    './timeline-toggle',
    './timeline-toggle-mediator',
    'handlebars'
], function (
    timelineToggleHBS,
    timelineToggle,
    timelineToggleMediator
){
    return {
        initialize: function() {
            var timelineToggleTemplate = Handlebars.compile(timelineToggleHBS);
            var html = timelineToggleTemplate({
                "appName": this.sandbox.systemConfiguration.appName
            });
            this.html(html);

            timelineToggleMediator.init(this);
            timelineToggle.init(this, timelineToggleMediator);
        }
    };

});