define([
    './inputArea-publisher',
    'bootstrap'
], function (publisher) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext,
            $submitBtn = context.$('#inputArea .btn'),
            $textArea = context.$('#inputArea input');
           
            $submitBtn.on('click', function(event){
                var input = $textArea.val();
                event.preventDefault();

                publisher.publishInput({
                    "message":input
                });
            });
        }
    };

    return exposed;
});