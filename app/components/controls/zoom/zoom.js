define([
    './zoom-mediator',
    'bootstrap'
], function (mediator) {
    var context,
        $zoomIn,
        $zoomOut;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $zoomIn = context.$('.zoom-in');
            $zoomOut = context.$('.zoom-out');
            $zoomIn.tooltip({
                container: 'body',
                delay: {
                    show: 500
                }
            });
            $zoomIn.click(function(event){
                event.preventDefault();
                mediator.zoomIn();
                $zoomIn.blur();
            });
            
            $zoomOut.tooltip({
                container: 'body',
                delay: {
                    show: 500
                }
            });
            $zoomOut.click(function(event){
                event.preventDefault();
                mediator.zoomOut();
                $zoomOut.blur();
            });    
        }
    };

    return exposed;

});