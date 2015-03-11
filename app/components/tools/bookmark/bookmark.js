define([
    './bookmark-publisher',
    'bootstrap'
], function (publisher) {

    var context,
        contentLoaded = false,
        $bookmarkModal,
        $bookmarkModalBody,
        $bookmarkCloseButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;

            $bookmarkModal = context.$('#bookmark-modal');
            $bookmarkModalBody = context.$('#bookmark-modal .modal-body');
            $bookmarkCloseButton = context.$('#bookmark-modal.modal button.close');


            $bookmarkModal.modal({
                "backdrop": true,
                "keyboard": true,
                "show": false
             }).on('hidden.bs.modal', function() {
                publisher.closeBookmark();
             });


            $bookmarkCloseButton.on('click', function(event) {
                event.preventDefault();
                publisher.closeBookmark();
            });

        },
        openBookmark: function() {
            //publisher.publishOpening({"componentOpening": SUPPORT_DESIGNATION});
            $bookmarkModal.modal('show');
        },
        closeBookmark: function() {
            $bookmarkModal.modal('hide');
        },

        clear: function() {
            $bookmarkModal.modal('hide');
            //$aboutModal.modal('hide');
        }
    };

    return exposed;

});