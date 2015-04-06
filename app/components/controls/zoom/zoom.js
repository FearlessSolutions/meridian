define([
    './zoom-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        $zoomIn,
        $zoomOut;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $zoomIn = context.$('#zoom .zoom-in');
            $zoomOut = context.$('#zoom .zoom-out');
            $zoomIn.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });
            $zoomIn.click(function(event){
                event.preventDefault();
                publisher.zoomIn();
                $zoomIn.blur();
            });
            
            $zoomOut.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });
            $zoomOut.click(function(event){
                event.preventDefault();
                publisher.zoomOut();
                $zoomOut.blur();
            });    
        }
    };

    return exposed;

});