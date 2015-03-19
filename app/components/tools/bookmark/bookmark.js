define([
    './bookmark-publisher',
    'text!./data-history-entry.hbs',
    'bootstrap',
    'handlebars',
    'moment'
], function (publisher, dataHistoryEntryHBS) {

    var context,
        dataHistoryEntryTemplate,
        //dataHistoryDetailViewTemplate,
        $bookmarkModal,
        $bookmarkModalBody,
        $bookmarkCloseButton,
        $dataHistoryListTable,
        $dataHistoryDetailView,
        $noDataLabel,
        currentDataArray = [],
        currentDataSet = {};

    var exposed = {
        init: function(thisContext) {
            context = thisContext;

            dataHistoryEntryTemplate = Handlebars.compile(dataHistoryEntryHBS);
            //dataHistoryDetailViewTemplate = Handlebars.compile(dataHistoryDetailViewHBS);

            $bookmarkModal = context.$('#bookmark-modal');
            $bookmarkModalBody = context.$('#bookmark-modal .modal-body');
            $bookmarkCloseButton = context.$('#bookmark-modal.modal button.close');

            $dataHistoryListTable = context.$('#bookmark-modal.modal .data-history-list');
            //$dataHistoryDetailView = context.$('#bookmark-modal.modal .data-history-detail-view');
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
            // Populate Data History table
            exposed.updateDataHistory();
            exposed.testfromTimeline();
            $bookmarkModal.modal('show');
        },
        closeBookmark: function() {
            $bookmarkModal.modal('hide');
        },

        clear: function() {
            $bookmarkModal.modal('hide');
        },
        testfromTimeline: function(dataObject) {

        },
        updateDataHistory: function() {
            var newAJAX = context.sandbox.utils.ajax({
                    type: 'GET',
                    url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/metadata/user',
                    xhrFields: {
                        withCredentials: true
                    }
            })
            .done(function(data) {
                currentDataSet = {};
                currentDataArray = [];

                context.sandbox.utils.each(data, function(index, dataEntry) {
                    var now = moment(), //This needs to be done now to prevent race condition later
                        dataDate = moment.unix(dataEntry.createdOn),
                        expireDate = moment.unix(dataEntry.expireOn),
                        disableRestore = expireDate.isBefore(now); // Use isExpired as default

                    if(!context.sandbox.dataServices[dataEntry.dataSource]){
                        console.debug('No datasource for', dataEntry);
                        return;
                    }

                    if(context.sandbox.stateManager.layers[dataEntry.queryId]){
                        disableRestore = true;
                    }

                    currentDataSet[dataEntry.queryId] = dataEntry;
                    currentDataArray.push({
                        datasetId: dataEntry.queryId,
                        dataName: dataEntry.queryName,
                        dataDate: dataDate.fromNow(),
                        rawDate: dataEntry.createdOn,
                        disableRestore: disableRestore
                    });
                });

                currentDataArray.sort(dynamicSort('-rawDate'));

                populateDataHistoryTable();
            });
        }
    };

    function populateDataHistoryTable() {
        $dataHistoryListTable.empty();
        context.sandbox.utils.each(currentDataArray, function(index, tempDataEntry) {
            var dataHistoryEntry = generateDataHistoryEntryRow(tempDataEntry);
            $dataHistoryListTable.append(dataHistoryEntry);
        });

        if($dataHistoryListTable.children().length === 0) {
            $noDataLabel.removeClass('hide');
        } else {
            $noDataLabel.addClass('hide');
        }

        context.$('.data-history-list .data-action-restore').on('click', function(event) {
            publisher.restoreDataset(currentDataSet[context.$(this).parent().parent().data('datasetid')]);
            publisher.closeBookmark();
        });
        context.$('.data-history-list .data-action-edit').on('click', function(event) {
            //exposed.showDetailedInfo({
            //    datasetId: context.$(this).parent().parent().data('datasetid')
            //});
            var bmData = JSON.parse(localStorage.getItem("storedBookmarks"));
            //context.sandbox.utils.each(bmData,function(obj, name) {
            //    var tempObj = {};
            //    tempObj.name = bmData.name;
            //    tempObj.maxLat = bmData.maxLat;
            //    tempObj.minLat = bmData.minLat;
            //    tempObj.maxLon = bmData.maxLon;
            //    tempObj.minLon = bmData.minLon;
            //});

                //var bmObj = [];
                //bmObj.push(JSON.parse(localStorage.getItem('storedBookmarks')));
                //localStorage.setItem('storedBookmarks', JSON.stringify(bmObj));
                //alert('');
            console.log(localStorage);

            //console.log(bmData);
        });
        context.$('.data-history-list .data-action-delete').on('click', function(event) {
            // Delete the dataset
            deleteDataset(context.$(this).parent().parent().data('datasetid'),
                context.$(this).parent().parent().data('datasessionid'));
        });
    }

    function generateDataHistoryEntryRow(dataHistoryEntryObject) {
        return dataHistoryEntryTemplate({
            datasetId: dataHistoryEntryObject.datasetId,
            dataSessionId: dataHistoryEntryObject.dataSessionId,
            dataSource: dataHistoryEntryObject.dataSource,
            dataName: dataHistoryEntryObject.dataName,
            disableRestore: dataHistoryEntryObject.disableRestore,
            dataDate: dataHistoryEntryObject.dataDate,
            dataRecordCount: dataHistoryEntryObject.dataRecordCount
        });
    }

    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === '-') {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        };
    }


    function deleteDataset(datasetId, dataSessionId) {

        //If the layer already exists on the map, delete it
        if(context.sandbox.stateManager.layers[datasetId]){
            publisher.deleteDataset({
                layerId: datasetId
            });
        }

        //Call the server to delete the features and query
        //NOTE: this is a GET because DELETE causes problems on the server
        context.sandbox.utils.ajax({
            type: 'GET',
            url: '/clear/' + datasetId + '/' + dataSessionId
        }).done(function() {
            var newDataArray = [];
            context.sandbox.utils.each(currentDataArray, function(index, tempDataEntry) {
                if(tempDataEntry.datasetId !== datasetId) {
                    newDataArray.push(tempDataEntry);
                } else {
                    delete currentDataSet[datasetId];
                }
            });
            currentDataArray = newDataArray;
            populateDataHistoryTable();
            publisher.publishMessage( {
                messageType: 'success',
                messageTitle: 'Bookmarks',
                messageText: 'Dataset successfully removed'
            });
        });
    }

    return exposed;

});