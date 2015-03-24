define([
    './bookmark-publisher',
    'text!./bookmark-entry.hbs',
    'bootstrap',
    'handlebars',
    'moment'
], function (publisher, bookmarkEntryHBS) {

    var context,
        bookmarkEntryTemplate,
        $bookmarkModal,
        $bookmarkModalBody,
        $bookmarkCloseButton,
        $bookmarkListTable,
        $noDataLabel;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;

            bookmarkEntryTemplate = Handlebars.compile(bookmarkEntryHBS);

            $bookmarkModal = context.$('#bookmark-modal');
            $bookmarkModalBody = context.$('#bookmark-modal .modal-body');
            $bookmarkCloseButton = context.$('#bookmark-modal.modal button.close');

            $bookmarkListTable = context.$('#bookmark-modal.modal .data-history-list');
            $noDataLabel = context.$('#bookmark-modal.modal p.noDataLabel');

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
            // Populate Bookmark table
            exposed.updateBookmarks();
            $bookmarkModal.modal('show');
        },
        closeBookmark: function() {
            $bookmarkModal.modal('hide');
        },

        clear: function() {
            $bookmarkModal.modal('hide');
        },
        saveBMtoLS: function(params) {
            var bookmarkId = params.layerId,
                storedBookmarks = context.sandbox.utils.preferences.get('storedBookmarks');
            if(!storedBookmarks){
                storedBookmarks = {};
            };
            storedBookmarks[bookmarkId] = {
                bmId: bookmarkId,
                // For now, the bookmark name is the same as the Query Name
                bmName: context.sandbox.dataStorage.datasets[params.layerId].layerName,
                maxLat: 'somevalue',
                minLat: 'somevalue',
                maxLon: 'somevalue',
                minLon: 'somevalue'
            };
            context.sandbox.utils.preferences.set('storedBookmarks', storedBookmarks);
            console.log(localStorage);
        },
        updateBookmarks: function() {
            var bmData = JSON.parse(localStorage.getItem("storedBookmarks"));
            $bookmarkListTable.empty();

            if ( bmData === null  || Object.keys(bmData).length == 0 )  {
                $noDataLabel.removeClass('hide');
            } else {
                context.sandbox.utils.each(bmData, function (index, tempDataEntry) {
                    var bookmarkEntry = generateDataHistoryEntryRow(tempDataEntry);
                    $bookmarkListTable.append(bookmarkEntry);
                });
                $noDataLabel.addClass('hide');
            }

            context.$('.data-history-list .data-action-restore').on('click', function(event) {
                publisher.restoreDataset(something[context.$(this).parent().parent().data('datasetid')]);
                publisher.closeBookmark();
            });
            context.$('.data-history-list .data-action-edit').on('click', function(event) {

                var bmData = JSON.parse(localStorage.getItem("storedBookmarks"));

                console.log(bmData);
            });
            context.$('.data-history-list .data-action-delete').on('click', function(event) {
                // Delete the bookmark
                deleteDataset(context.$(this).parent().parent().data('bmid'));
                $(this).parent().parent('tr').remove();
            });

        }
    };

    function generateDataHistoryEntryRow(bookmarkEntryObject) {
        return bookmarkEntryTemplate({
            bmId: bookmarkEntryObject.bmId,
            name: bookmarkEntryObject.bmName,
            maxLat: bookmarkEntryObject.maxLat
        });
    }

    function deleteDataset(bookmarkId) {
        var storedBookmarks = context.sandbox.utils.preferences.get('storedBookmarks');
        delete storedBookmarks[bookmarkId];
        context.sandbox.utils.preferences.set('storedBookmarks', storedBookmarks);

        console.log(localStorage);

        publisher.publishMessage( {
            messageType: 'success',
            messageTitle: 'Bookmarks',
            messageText: 'Bookmark successfully removed'
        });
    }

    return exposed;

});