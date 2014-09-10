define([
    './data-history-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        MENU_DESIGNATION = 'data-history',
        $modal,
        $cancelButton,
        $closeButton;
    
    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $modal = context.$('#data-history-modal');
            $cancelButton = context.$('#data-history-cancel');
            $closeButton = context.$('#data-history-modal.modal button.close');

            $modal.modal({
                "backdrop": true,
                "keyboard": true,
                "show": false
             }).on('hidden.bs.modal', function() {
                publisher.closeDataHistory();
             });

            $cancelButton.on('click', function(event) {
                event.preventDefault();
                publisher.closeDataHistory();
            });

            $closeButton.on('click', function(event) {
                event.preventDefault();
                publisher.closeDataHistory();
            }); 

            context.$('.data-action-info').on('click', function(event) {
                context.$('.data-history-list').addClass('hidden');
                context.$('.data-history-detail-view').removeClass('hidden');
            })
        },
        open: function() {
            publisher.publishOpening({"componentOpening": MENU_DESIGNATION});
            $modal.modal('show');
        },
        close: function() {
            $modal.modal('hide');
        },
        clear: function() {
            $modal.modal('hide');
        }
    };

    return exposed;
});