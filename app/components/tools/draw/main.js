define([
    './draw',
    './draw-mediator',
    'handlebars'
], function (
    drawTool,  
    drawToolMediator
) {

    return {
        initialize: function() {
            drawTool.init(this);
            drawToolMediator.init(this, drawToolMediator);
        }
    };
                
});