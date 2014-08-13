define([
    './modalDisplay-publisher',
    'bootstrap'
], function (publisher) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.$('.modal').modal({
                show: false
            });

            context.$('.btn.btn-primary').on('click',function(event){
                event.preventDefault();
                publisher.emitSuccess();
                context.$('.modal').modal('hide');

            });
        },
        openModal: function(params){
            if(params.message !== ""){
                var content = "Message sent was: " + params.message + '<br> Click OK to send the modal.display.success message, if not, it will not be sent.';
                context.$('.modal-body').html("");//clear any old values.
                context.$('.modal-body').html(content);
                context.$('.modal').modal('toggle');
            }
        }
    };

    return exposed;
});