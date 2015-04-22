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
            $bookmarkListTable = context.$('#bookmark-modal.modal .bookmark-list');
            $noDataLabel = context.$('#bookmark-modal.modal p.noDataLabel');

            $bookmarkModal.modal({
                backdrop: true,
                keyboard: true,
                show: false
             }).on('hidden.bs.modal', function() {
                publisher.closeBookmark();
             });

            $bookmarkCloseButton.on('click', function(event) {
                event.preventDefault();
                publisher.closeBookmark();
            });
        },
        openBookmark: function() {
            var bmData =  context.sandbox.utils.preferences.get('storedBookmarks');
            if(!context.sandbox.utils.isEmptyObject(bmData)) {
                // Populate Bookmark table
                exposed.updateBookmarks();
                $bookmarkModal.modal('show');
            } else {
                publisher.closeBookmark();
                publisher.publishMessage( {
                    messageType: 'warning',
                    messageTitle: 'Bookmarks',
                    messageText: 'No data to display in table'
                });
            }
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
            }
            if(bookmarkId in storedBookmarks) {
                publisher.publishMessage({
                    messageType: "warning",
                    messageTitle: "Bookmarks",
                    messageText: "Bookmark already exists"
                });
            } else {
                // saves to bookmarks
                context.sandbox.dataStorage.getMetadataById(bookmarkId, function(data) {
                    var bbox = data.queryBbox;
                    storedBookmarks[bookmarkId] = {
                        bmId: bookmarkId,
                        // For now, the bookmark name is the same as the Query Name
                        bmName: data.queryName,
                        maxLat: bbox.maxLat,
                        minLat: bbox.minLat,
                        maxLon: bbox.maxLon,
                        minLon: bbox.minLon
                    };
                    context.sandbox.utils.preferences.set('storedBookmarks', storedBookmarks);

                    publisher.publishMessage({
                        messageType: "success",
                        messageTitle: "Bookmarks",
                        messageText: "Bookmark successfully created"
                    });
                });
            }
        },
        updateBookmarks: function() {
            var bmData = context.sandbox.utils.preferences.get('storedBookmarks');
            $bookmarkListTable.empty();
            if ( bmData === null  || context.sandbox.utils.isEmptyObject(bmData))  {
                $noDataLabel.removeClass('hide');
            } else {
                $noDataLabel.addClass('hide');
            }

            context.sandbox.utils.each(bmData, function (index, tempDataEntry) {
                $bookmarkListTable.append(generateBookmarkEntryRow(tempDataEntry));
            });

            context.$('.bookmark-list .data-action-jump').on('click', function(event) {
                var selectedBMId = context.$(this).parent().parent().data('bmid');
                var storedBookmark = context.sandbox.utils.preferences.get('storedBookmarks')[selectedBMId];
                publisher.jumpToBookmark({
                    minLon: storedBookmark.minLon,
                    minLat: storedBookmark.minLat,
                    maxLon: storedBookmark.maxLon,
                    maxLat: storedBookmark.maxLat
                });
                publisher.closeBookmark();
            });
            context.$('.bookmark-list .data-action-edit').on('click', function(event) {
                var $dataName = context.$(this).parent().parent().children('.data-name'),
                    $dataActions = context.$(this).parent().parent().children('.data-actions'),
                    $origName = $dataName.children('input').val();
                $dataName.children('label').hide();
                $dataName.children('input').val('').show().focus().val($origName);
                $dataActions.children('button').hide();
                $dataActions.children('.pull-right').show();
            });
            context.$('.bookmark-list .data-action-delete').on('click', function(event) {
                // Delete the bookmark
                deleteBookmark(context.$(this).parent().parent().data('bmid'));
                exposed.updateBookmarks();
            });
            context.$('.bookmark-list button[type="submit"]').on('click', function(e) {
                saveEditBM(context.$(this));
            });
            // the input inside a row when editing the nane
            context.$('.bookmark-list input').on('keydown', function(e) {
                if (e.keyCode === 13) {
                    saveEditBM(context.$(this));
                }
            });
            context.$('.bookmark-list button[type="cancel"]').on('click', function(event) {
                var $dataName = context.$(this).parent().parent().children('.data-name'),
                    $dataActions = context.$(this).parent().parent().children('.data-actions');
                $dataName.children('label').show();
                $dataName.children('input').hide();
                $dataActions.children('button').hide();
                $dataActions.children('.btn-default-icon').show();
            });
        }
    };

    function generateBookmarkEntryRow(bookmarkEntryObject) {
        return bookmarkEntryTemplate({
            bmId: bookmarkEntryObject.bmId,
            name: bookmarkEntryObject.bmName
        });
    }
    function saveEditBM($submitOrigin) {
        var renameBMId = $submitOrigin.parent().parent().data('bmid'),
            storedBookmarks = context.sandbox.utils.preferences.get('storedBookmarks'),
            $dataName = $submitOrigin.parent().parent().children('.data-name'),
            $dataActions = $submitOrigin.parent().parent().children('.data-actions'),
            newBMName = $dataName.children('input').val();

        if ($dataName.children('input').val() === '') {
            // add error class to input here later
            $dataName.children('input').focus();
            publisher.publishMessage( {
                messageType: 'error',
                messageTitle: 'Bookmarks',
                messageText: 'Bookmark name must have at least one character'
            });
        } else {
            storedBookmarks[renameBMId] = {
                bmId: storedBookmarks[renameBMId].bmId,
                bmName: newBMName,
                maxLat: storedBookmarks[renameBMId].maxLat,
                minLat: storedBookmarks[renameBMId].minLat,
                maxLon: storedBookmarks[renameBMId].maxLon,
                minLon: storedBookmarks[renameBMId].minLon
            };
            context.sandbox.utils.preferences.set('storedBookmarks', storedBookmarks);
            $dataName.children('label').text(newBMName).show();
            $dataName.children('input').hide();
            $dataActions.children('button').hide();
            $dataActions.children('.btn-default-icon').show();
        }
    }

    function deleteBookmark(bookmarkId) {
        var storedBookmarks = context.sandbox.utils.preferences.get('storedBookmarks');
        delete storedBookmarks[bookmarkId];
        context.sandbox.utils.preferences.set('storedBookmarks', storedBookmarks);

        publisher.publishMessage( {
            messageType: 'success',
            messageTitle: 'Bookmarks',
            messageText: 'Bookmark successfully removed'
        });
    }

    return exposed;

});