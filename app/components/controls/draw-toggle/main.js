define([
    'text!./draw-toggle.hbs',
    './draw-toggle',
    './draw-toggle-publisher',
    './draw-toggle-subscriber',
    'handlebars'
], function (
    drawToggleHBS,
    drawToggle,
    drawTogglePublisher,
    drawToggleSubscriber
){
    return {
        initialize: function() {
            var drawToggleTemplate = Handlebars.compile(drawToggleHBS);
            var html = drawToggleTemplate();
            this.html(html);

            drawToggle.init(this);
            drawTogglePublisher.init(this);
            drawToggleSubscriber.init(this);
        }
    };

});