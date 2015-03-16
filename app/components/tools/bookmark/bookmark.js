define([
    './bookmark-publisher',
    'bootstrap',
    'handlebars',
    'moment'
], function (publisher, dataHistoryHBS, dataHistoryDetailViewHBS) {

    var context,
        dataHistoryEntryTemplate,
        dataHistoryDetailViewTemplate,
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
            $bookmarkModal.modal('show');
        },
        closeBookmark: function() {
            $bookmarkModal.modal('hide');
        },
        clear: function() {
            $bookmarkModal.modal('hide');
        }
    };

    return exposed;

});