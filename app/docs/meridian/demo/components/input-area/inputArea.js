define([
    './inputArea-publisher'
], function (publisher) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext,
            $submitBtn = context.$('#inputArea .btn'),
            $textArea = context.$('#inputArea input');
           
            $submitBtn.on('click', function(event){
                event.preventDefault();
                var input = $textArea.val();

                publisher.publishInput({
                    "message":input
                });
            });
        }
    };

    return exposed;
});