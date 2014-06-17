define([
    './clear-toggle-publisher',
    'bootstrap'
], function (publisher) {

    var context,
        $toggleButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $toggleButton = context.$('#clear-toggle');

            $toggleButton.on('click', function(event){
                publisher.publishOpenClearDialog();
            });
        }
    };

    return exposed;

});