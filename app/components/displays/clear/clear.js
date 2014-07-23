define([
    './clear-publisher',
    'bootstrap'
], function (publisher) {

    var context,
        MENU_DESIGNATION = 'clear',
        $modal,
        $cancelButton,
        $clearConfirm;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $modal = context.$('#clear-modal');
            $cancelButton = context.$('#cancel-clear');
            $clearButton = context.$('#accept-clear');

            $modal.modal({
                "backdrop": true,
                "keyboard": true,
                "show": false
             });

            $cancelButton.on('click', function(e){
                closeMenu();
            });

            $clearButton.on('click', function(e){
                publisher.publishClear();
            });
        },
        open: function(params){
            publisher.publishOpening({"componentOpening": MENU_DESIGNATION});
            $modal.modal('show');
        },
        clear: function(){
            closeMenu();
        }
    };

    return exposed;

    /**
      * Closes the clear menu.
      * Since clicking the button will toggle the button after this is 
      * finished, don't toggle the class here if it is bubbling
      */
    function closeMenu(){
        $modal.modal('hide');
    }
});