define([
    './data-history-publisher',
    'text!./data-history-entry.hbs',
    'text!./data-history-detail-view.hbs',
    'bootstrap',
    'handlebars',
    'moment'
], function (publisher, dataHistoryEntryHBS, dataHistoryDetailViewHBS) {
    var context,
        dataHistoryEntryTemplate,
        dataHistoryDetailViewTemplate,
        MENU_DESIGNATION = 'data-history',
        $modal,
        $modalBody,
        $closeButton,
        $dataHistoryListTable,
        $dataHistoryDetailView,
        $noDataLabel,
        currentDataArray = [],
        currentDataSet = {};
    
    var exposed = {
        init: function(thisContext) {
            context = thisContext;

            dataHistoryEntryTemplate = Handlebars.compile(dataHistoryEntryHBS);
            dataHistoryDetailViewTemplate = Handlebars.compile(dataHistoryDetailViewHBS);

            $modal = context.$('#data-history-modal');
            $modalBody = context.$('#data-history-modal .modal-body');

            $closeButton = context.$('#data-history-modal.modal button.close');
            $dataHistoryListTable = context.$('#data-history-modal.modal .data-history-list');
            $dataHistoryDetailView = context.$('#data-history-modal.modal .data-history-detail-view');
            $noDataLabel = context.$('#data-history-modal.modal p.noDataLabel');

            $modal.modal({
                backdrop: true,
                keyboard: true,
                show: false
            }).on('hidden.bs.modal', function() {
                publisher.closeDataHistory();
                exposed.hideDetailedInfo();
            });

            $closeButton.on('click', function(event) {
                event.preventDefault();
                publisher.closeDataHistory();
            }); 

            context.$('.expiration span').tooltip();
        },
        open: function() {
            publisher.publishOpening({componentOpening: MENU_DESIGNATION});

            // Populate Data History table
            exposed.updateDataHistory();

            $modal.modal('show');
        },
        close: function() {
            $modal.modal('hide');
        },
        showDetailedInfo: function(dataObject) {
            var newAJAX = context.sandbox.utils.ajax({
                type: 'GET',
                url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/metadata/query/' + dataObject.datasetId,
                xhrFields: {
                    withCredentials: true
                }
            })
            .done(function(data) {
                var now = moment(), //This needs to be done now to prevent race condition later
                    dataDate = moment.unix(data.createdOn),
                    expireDate = moment.unix(data.expireOn),
                    isExpired = expireDate.isBefore(now),
                    disableRestore = isExpired, //Use this as default
                    tempData,
                    rawDataObjectString,
                    dataHistoryDetailView,
                    dataStatus = isExpired ? 'Expired' : 'N/A';

                if(context.sandbox.stateManager.layers[data.queryId]){
                    disableRestore = true;
                }

                tempData = {
                    datasetId: data.queryId,
                    dataSessionId: data.sessionId,
                    dataSource: data.dataSource || 'N/A',
                    dataName: data.queryName || 'N/A',
                    dataDate: dataDate.format('MMMM Do YYYY, h:mm:ss a') || 'N/A',
                    dataRecordCount: data.numRecords || 'N/A',
                    dataExpiresOn: expireDate.format('MMMM Do YYYY, h:mm:ss a') || 'N/A',
                    disableRestore: disableRestore,
                    dataStatus: dataStatus,
                    rawDataObject: data.rawQuery || 'N/A'
                };

                rawDataObjectString = context.sandbox.utils.isEmptyObject(tempData.rawDataObject)
                    ? '' : JSON.stringify(tempData.rawDataObject, null,  ' ');
                tempData.rawDataObject = rawDataObjectString;

                dataHistoryDetailView = dataHistoryDetailViewTemplate(tempData);
                $dataHistoryDetailView.html(dataHistoryDetailView);

                context.$('.data-history-detail-view .data-history-modal-back-to-list').on('click', function(event) {
                    exposed.hideDetailedInfo();
                });
                context.$('.data-history-detail-view .data-action-restore').on('click', function(event) {
                    publisher.restoreDataset(data);
                    publisher.closeDataHistory();
                });
                context.$('.data-history-detail-view .data-action-delete').on('click', function(event) {
                    // Delete the dataset
                    deleteDataset(tempData.datasetId, tempData.dataSessionId);
                    exposed.hideDetailedInfo();
                });

                $modalBody.addClass('finiteHeight');
                context.$('.data-history-summary-list-container').addClass('hidden');
                context.$('.data-history-detail-view').removeClass('hidden');
            });
        },
        hideDetailedInfo: function() {
            $modalBody.removeClass('finiteHeight');
            context.$('.data-history-summary-list-container').removeClass('hidden');
            context.$('.data-history-detail-view').addClass('hidden');
        },
        clear: function() {
            $modal.modal('hide');
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
                        disableRestore = expireDate.isBefore(now), // Use isExpired as default
                        tempDataEntry;

                    if(context.sandbox.stateManager.layers[dataEntry.queryId]){
                        disableRestore = true;
                    }

                    tempDataEntry = {
                        datasetId: dataEntry.queryId,
                        dataSessionId: dataEntry.sessionId,
                        dataSource: context.sandbox.dataServices[dataEntry.dataSource].DISPLAY_NAME,
                        dataName: dataEntry.queryName,
                        dataDate: dataDate.fromNow(),
                        rawDate: dataEntry.createdOn,
                        disableRestore: disableRestore,
                        dataRecordCount: dataEntry.numRecords
                    };
                    currentDataArray.push(tempDataEntry);
                    currentDataSet[dataEntry.queryId] = dataEntry;
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

        context.$('.data-history-list .data-action-info').on('click', function(event) {
            exposed.showDetailedInfo({
                datasetId: context.$(this).parent().parent().data('datasetid')
            });
        });
        context.$('.data-history-list .data-action-restore').on('click', function(event) {
            publisher.restoreDataset(currentDataSet[context.$(this).parent().parent().data('datasetid')]);
            publisher.closeDataHistory();
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
                messageTitle: 'Data History',
                messageText: 'Dataset successfully removed'
            });
        });
    }

    return exposed;
});