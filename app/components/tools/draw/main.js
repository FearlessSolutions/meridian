define([
    './draw',
    './draw-publisher',
    './draw-subscriber',
    'handlebars'
], function (drawTool, drawToolPublisher, drawToolSubscriber) {

    return {
        initialize: function() {
            drawToolPublisher.init(this);
            drawTool.init(this);
            drawToolSubscriber.init(this);
        }
    };
                
});