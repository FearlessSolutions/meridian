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
                exposed.hideDetailedInfo();
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
                exposed.showDetailedInfo();
            });
            context.$('.data-history-modal-back-to-list').on('click', function(event) {
                exposed.hideDetailedInfo();
            });

            context.$('.data-action-restore').on('click', function(event) {
                var result = confirm("Want to restore this data?");
                if (result==true) {
                    context.$(this).prop('disabled', true);
                    publisher.closeDataHistory();
                } 
            });

            context.$('.data-action-delete').on('click', function(event) {
                var result = confirm("Want to delete?");
                if (result==true) {
                    context.$(this).parents('tr').hide();
                } 
            });

            context.$('.expiration span').tooltip();

        },
        open: function() {
            publisher.publishOpening({"componentOpening": MENU_DESIGNATION});
            $modal.modal('show');
        },
        close: function() {
            $modal.modal('hide');
        },
        showDetailedInfo: function() {
            context.$('.data-history-list').addClass('hidden');
            context.$('.data-history-modal-back-to-list').removeClass('hidden');
            context.$('.data-history-detail-view').removeClass('hidden');
        },
        hideDetailedInfo: function() {
            context.$('.data-history-list').removeClass('hidden');
            context.$('.data-history-modal-back-to-list').addClass('hidden');
            context.$('.data-history-detail-view').addClass('hidden');
        },
        clear: function() {
            $modal.modal('hide');
        }
    };

    return exposed;
});