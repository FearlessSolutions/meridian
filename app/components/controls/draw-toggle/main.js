define([
    'text!./draw-toggle.css',
    'text!./draw-toggle.hbs',
    './draw-toggle',
    './draw-toggle-publisher',
    './draw-toggle-subscriber',
    'handlebars'
], function (
    drawToggleCSS,
    drawToggleHBS,
    drawToggle,
    drawTogglePublisher,
    drawToggleSubscriber
){
    return {
        initialize: function() {
            this.sandbox.utils.addCSS(drawToggleCSS, 'controls-draw-toggle-component-style');

            var drawToggleTemplate = Handlebars.compile(drawToggleHBS);
            var html = drawToggleTemplate();
            this.html(html);

            drawToggle.init(this);
            drawTogglePublisher.init(this);
            drawToggleSubscriber.init(this);
        }
    };

});