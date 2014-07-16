define([
    './zoom-publisher',
    'bootstrap'
], function (publisher) {
    var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.$('#zoom .zoom-in').tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });
            context.$('#zoom .zoom-in').click(function(event){
                event.preventDefault();
                publisher.zoomIn();
            });
            
            context.$('#zoom .zoom-out').tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });
            context.$('#zoom .zoom-out').click(function(event){
                event.preventDefault();
                publisher.zoomOut();
            });    
        }
    };

    return exposed;

});