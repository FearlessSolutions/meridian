define([
    'text!./draw-toggle.hbs',
    './draw-toggle',
    './draw-toggle-mediator',
    'handlebars'
], function (
    drawToggleHBS,
    drawToggle,
    drawToggleMediator,
    Handlebars
){
    return {
        initialize: function() {
            var drawToggleTemplate = Handlebars.compile(drawToggleHBS);
            var html = drawToggleTemplate();
            this.html(html);

            drawToggleMediator.init(this);
            drawToggle.init(this, drawToggleMediator);
        }
    };

});