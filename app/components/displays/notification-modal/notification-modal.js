define([
], function() {

    var context,
        modalInitialized,
        $modalContainer,
        $modalBody,
        currentOrigin;

    var exposed = { 
        /**
          * Initialize the modal variables.
          * You can't initialize the actual modal here
          * because the element is not ready fast enough.
          */
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;
            modalInitialized = false;
            $modalContainer = context.$('#notification-modal');
            $modalBody = context.$('.modal-body');

            currentOrigin = '';
            context.$('#notification-modal-confirm').on('click', function(event){
                mediator.publishConfirmation({
                    "origin": currentOrigin
                });
            });
        },
        open: function(params) {
            if(!modalInitialized){
               $modalContainer.modal({
                    "backdrop": "static",
                    "keyboard": false,
                    "show": false
                }); 

                modalInitialized = true;
            }

            $modalBody.html(params.body);
            currentOrigin = params.origin;
            $modalContainer.modal('show');
        },
        close: function(){
            if(modalInitialized){
                $modalContainer.modal('hide');
            }
            
            currentOrigin = '';
        },
        clear: function(){
            exposed.close();
        }

    };

    return exposed;

});
