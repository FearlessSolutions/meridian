define([
    'text!./draw.css',
    'text!./draw.hbs',
    './draw',
    './draw-publisher',
    './draw-subscriber',
    'handlebars'
], function (drawToolCSS, drawToolHBS, drawTool, drawToolPublisher, drawToolSubscriber) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(drawToolCSS, 'tools-draw-component-style');

            var drawToolTemplate = Handlebars.compile(drawToolHBS);
            var html = drawToolTemplate({datasources: this.sandbox.datasources});
            this.html(html);

            drawToolPublisher.init(this);
            drawTool.init(this);
            drawToolSubscriber.init(this);
        }
    };
                
});