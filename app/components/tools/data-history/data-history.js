define([
    './data-history-publisher',
    'text!./data-history-entry.hbs',
    'text!./data-history-detail-view.hbs',
    'bootstrap',
    'handlebars',
    'momentJS'
], function (publisher, dataHistoryEntryHBS, dataHistoryDetailViewHBS) {
    var context,
        dataHistoryEntryTemplate,
        dataHistoryDetailViewTemplate,
        MENU_DESIGNATION = 'data-history',
        $modal,
        $modalBody,
        $cancelButton,
        $closeButton,
        $dataHistoryListTable,
        $dataHistoryDetailView;
    
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

            $modal.modal({
                "backdrop": true,
                "keyboard": true,
                "show": false
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
            publisher.publishOpening({"componentOpening": MENU_DESIGNATION});

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
            .done(function(data){

                var tempData = {
                    "datasetId": data.queryId,
                    "dataSource": data.dataSource || "N/A",
                    "dataName": data.queryName || "N/A",
                    "dataDate": moment.unix(data.createdOn).format("MMMM Do YYYY, h:mm:ss a") || "N/A",
                    "dataRecordCount": data.numRecords || "N/A",
                    "dataExpiresOn": moment.unix(data.expireOn).format("MMMM Do YYYY, h:mm:ss a") || "N/A",
                    "dataStatus": "N/A",
                    "rawDataObject": data.rawQuery || "N/A"
                };

                var rawDataObjectString = JSON.stringify(tempData.rawDataObject, null, "  ");
                tempData.rawDataObject = rawDataObjectString;

                var dataHistoryDetailView = dataHistoryDetailViewTemplate(tempData);
                $dataHistoryDetailView.html(dataHistoryDetailView);

                context.$('.data-history-detail-view .data-history-modal-back-to-list').on('click', function(event) {
                    exposed.hideDetailedInfo();
                });
                context.$('.data-history-detail-view .data-action-restore').on('click', function(event) {
                    publisher.restoreDataset({
                        "datasetId": tempData.datasetId,
                        "dataSource": tempData.dataSource
                    });
                });
                // context.$('.data-history-detail-view .data-action-delete').on('click', function(event) {
                //     // Delete the dataset
                //     console.debug('Will delete dataset ' + tempData.datasetId + ' here.');
                // });

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
            // Clear previous data history list
            $dataHistoryListTable.empty();

            var newAJAX = context.sandbox.utils.ajax({
                type: 'GET',
                url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/metadata/user',
                xhrFields: {
                    withCredentials: true
                }
            })
            .done(function(data){

                context.sandbox.utils.each(data, function(index, dataEntry) {
                    var tempDataEntry = {
                        "datasetId": dataEntry.queryId,
                        "dataSource": dataEntry.dataSource,
                        "dataName": dataEntry.queryName,
                        "dataDate": moment.unix(dataEntry.createdOn).fromNow(),
                        "dataRecordCount": dataEntry.numRecords
                    };
                    var dataHistoryEntry = generateDataHistoryEntryRow(tempDataEntry);
                    $dataHistoryListTable.append(dataHistoryEntry);
                });

                context.$('.data-history-list .data-action-info').on('click', function(event) {
                    exposed.showDetailedInfo({
                        "datasetId": context.$(this).parent().parent().data('datasetid')
                    });
                });
                context.$('.data-history-list .data-action-restore').on('click', function(event) {
                    publisher.restoreDataset({
                        "datasetId": context.$(this).parent().parent().data('datasetid'),
                        "dataSource": context.$(this).parent().parent().data('datasource')
                    });
                });
                // context.$('.data-history-list .data-action-delete').on('click', function(event) {
                //     // Delete the dataset
                //     console.debug('Will delete dataset ' + context.$(this).parent().parent().data('datasetid') + ' here.');
                // });

            });
        }
    };

    function generateDataHistoryEntryRow(dataHistoryEntryObject) {
        return dataHistoryEntryTemplate({
            "datasetId": dataHistoryEntryObject.datasetId,
            "dataSource": dataHistoryEntryObject.dataSource,
            "dataName": dataHistoryEntryObject.dataName,
            "dataDate": dataHistoryEntryObject.dataDate,
            "dataRecordCount": dataHistoryEntryObject.dataRecordCount
        });
    }

    return exposed;
});