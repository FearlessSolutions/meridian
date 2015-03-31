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
        $noDataLabel,
        bmData;

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
            bmData = JSON.parse(localStorage.getItem("storedBookmarks"));
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
            };
            context.sandbox.utils.ajax({
                type: "GET",
                url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/metadata/query/' + params.layerId
            })
            .done(function(data) {
                storedBookmarks[bookmarkId] = {
                    bmId: bookmarkId,
                    // For now, the bookmark name is the same as the Query Name
                    bmName: data.queryName,
                    maxLat: data.rawQuery.maxLat,
                    minLat: data.rawQuery.minLat,
                    maxLon: data.rawQuery.maxLon,
                    minLon: data.rawQuery.minLon
                };
                context.sandbox.utils.preferences.set('storedBookmarks', storedBookmarks);

                publisher.publishMessage({
                    "messageType": "success",
                    "messageTitle": "Bookmarks",
                    "messageText": "Bookmark successfully created"
                });
            });
        },
        updateBookmarks: function() {
            bmData = JSON.parse(localStorage.getItem("storedBookmarks"));
            $bookmarkListTable.empty();
            if ( bmData === null  || Object.keys(bmData).length == 0 )  {
                $noDataLabel.removeClass('hide');
            } else {
                $noDataLabel.addClass('hide');
            };

            context.sandbox.utils.each(bmData, function (index, tempDataEntry) {
                var bookmarkEntry = generateBookmarkEntryRow(tempDataEntry);
                $bookmarkListTable.append(bookmarkEntry);
            });

            context.$('.bookmark-list .data-action-jump').on('click', function(event) {
                var selectedBMId = context.$(this).parent().parent().data('bmid');
                var storedBookmarks = context.sandbox.utils.preferences.get('storedBookmarks');
                publisher.jumpToBookmark({
                    minLon: storedBookmarks[selectedBMId].minLon,
                    minLat: storedBookmarks[selectedBMId].minLat,
                    maxLon: storedBookmarks[selectedBMId].maxLon,
                    maxLat: storedBookmarks[selectedBMId].maxLat
                });
                publisher.closeBookmark();
            });
            context.$('.bookmark-list .data-action-edit').on('click', function(event) {
                var $origName = context.$(this).parent().parent().children('.data-name').children('input').val();
                context.$(this).parent().parent().children('.data-name').children('label').hide();
                context.$(this).parent().parent().children('.data-name').children('input').val('').show().focus().val($origName);
                context.$(this).parent().parent().children('.data-actions').children('button').hide();
                context.$(this).parent().parent().children('.data-actions').children('.pull-right').show();
            });
            context.$('.bookmark-list .data-action-delete').on('click', function(event) {
                // Delete the bookmark
                deleteBookmark(context.$(this).parent().parent().data('bmid'));
                exposed.updateBookmarks();
            });
            context.$('.bookmark-list button[type="submit"]').on('click', function(event) {
                var renameBMId = context.$(this).parent().parent().data('bmid');
                var storedBookmarks = context.sandbox.utils.preferences.get('storedBookmarks');
                var newBMName = context.$(this).parent().parent().children('.data-name').children('input').val();
                storedBookmarks[renameBMId] = {
                    bmId: storedBookmarks[renameBMId].bmId,
                    bmName: newBMName,
                    maxLat: storedBookmarks[renameBMId].maxLat,
                    minLat: storedBookmarks[renameBMId].minLat,
                    maxLon: storedBookmarks[renameBMId].maxLon,
                    minLon: storedBookmarks[renameBMId].minLon
                }
                context.sandbox.utils.preferences.set('storedBookmarks', storedBookmarks);
                context.$(this).parent().parent().children('.data-name').children('label').text(newBMName).show();
                context.$(this).parent().parent().children('.data-name').children('input').hide();
                context.$(this).parent().parent().children('.data-actions').children('button').hide();
                context.$(this).parent().parent().children('.data-actions').children('.btn-default-icon').show();
            });
            context.$('.bookmark-list button[type="cancel"]').on('click', function(event) {
                context.$(this).parent().parent().children('.data-name').children('label').show();
                context.$(this).parent().parent().children('.data-name').children('input').hide();
                context.$(this).parent().parent().children('.data-actions').children('button').hide();
                context.$(this).parent().parent().children('.data-actions').children('.btn-default-icon').show();
            });
        }
    };

    function generateBookmarkEntryRow(bookmarkEntryObject) {
        return bookmarkEntryTemplate({
            bmId: bookmarkEntryObject.bmId,
            name: bookmarkEntryObject.bmName
        });
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