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
            drawToolMediator.init(this);
            drawTool.init(this, drawToolMediator);

        }
    };
                
});