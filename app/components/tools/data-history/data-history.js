define([
    './data-history-publisher',
    'text!./data-history-entry.hbs',
    'text!./data-history-detail-view.hbs',
    'bootstrap',
    'handlebars'
], function (publisher, dataHistoryEntryHBS, dataHistoryDetailViewHBS) {
    var context,
        dataHistoryEntryTemplate,
        dataHistoryDetailViewTemplate,
        MENU_DESIGNATION = 'data-history',
        $modal,
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
            var datasetId = dataObject.datasetId;
            console.debug(datasetId);

            /**
             * Get metadata from server for specific dataset by datasetId
             */

            // Dummy data that would be returned by server
            var data = {
                "datasetId": "123",
                "dataName": "Test Dataset 1",
                "dataDate": "Mon. 12/12/12 @12:00:00",
                "dataRecordCount": "12,000",
                "dataExpiresOn": "Mon. 01/12/12 @08:00:00",
                "dataStatus": "Finished",
                "rawDataObject": {
                    "datasetId": "123",
                    "dataName": "Test Dataset 1",
                    "dataDate": "Mon. 12/12/12 @12:00:00",
                    "dataRecordCount": "12,000",
                    "dataExpiresOn": "Mon. 01/12/12 @08:00:00",
                    "dataStatus": "Finished",
                    "coords": {
                        "lat": 0,
                        "lon": 0
                    }
                }
            };

            var rawDataObjectString = JSON.stringify(data.rawDataObject, null, "  ");
            data.rawDataObject = rawDataObjectString;

            var dataHistoryDetailView = dataHistoryDetailViewTemplate(data);
            $dataHistoryDetailView.html(dataHistoryDetailView);

            context.$('.data-history-modal-back-to-list').on('click', function(event) {
                exposed.hideDetailedInfo();
            });
            context.$('.data-action-restore').on('click', function(event) {
                var result = confirm("Want to restore this data?");
                if(result === true) {
                    context.$(this).prop('disabled', true);
                    publisher.closeDataHistory();
                } 
            });
            context.$('.data-action-delete').on('click', function(event) {
                var result = confirm("Want to delete?");
                if(result === true) {
                    context.$(this).parents('tr').hide();
                } 
            });

            context.$('.data-history-summary-list-container').addClass('hidden');
            context.$('.data-history-detail-view').removeClass('hidden');
        },
        hideDetailedInfo: function() {
            context.$('.data-history-summary-list-container').removeClass('hidden');
            context.$('.data-history-detail-view').addClass('hidden');
        },
        clear: function() {
            $modal.modal('hide');
        },
        updateDataHistory: function() {
            // Clear previous data history list
            $dataHistoryListTable.html('');

            // Dummy data that would be returned by server
            var data = [
                {
                    "datasetId": "123",
                    "dataName": "Test Dataset 1",
                    "dataDate": "Mon. 12/12/12 @12:00:00",
                    "dataRecordCount": "12,000"
                },
                {
                    "datasetId": "1234",
                    "dataName": "Test Dataset 2",
                    "dataDate": "Thurs. 11/11/11 @12:00:00",
                    "dataRecordCount": "5,000"
                },
                {
                    "datasetId": "12345",
                    "dataName": "Test Dataset 3",
                    "dataDate": "Tues. 10/10/10 @12:00:00",
                    "dataRecordCount": "25,000"
                }
                // {
                //     "queryId": "12345",
                //     "dataName": "Test Query Dataset 3",
                //     "dataDate": "Tues. 10/10/10 @12:00:00",
                //     "dataRecordCount": "25,000"
                // },
                // {
                //     "dataName": "Test Query Dataset 3",
                //     "dataDate": "Tues. 10/10/10 @12:00:00",
                //     "dataRecordCount": "25,000"
                // },
                // {
                //     "dataName": "Test Query Dataset 3",
                //     "dataDate": "Tues. 10/10/10 @12:00:00",
                //     "dataRecordCount": "25,000"
                // },
                // {
                //     "dataName": "Test Query Dataset 3",
                //     "dataDate": "Tues. 10/10/10 @12:00:00",
                //     "dataRecordCount": "25,000"
                // },
                // {
                //     "dataName": "Test Query Dataset 3",
                //     "dataDate": "Tues. 10/10/10 @12:00:00",
                //     "dataRecordCount": "25,000"
                // }
            ];

            context.sandbox.utils.each(data, function(index, dataEntry) {
                var dataHistoryEntry = generateDataHistoryEntryRow(dataEntry);
                $dataHistoryListTable.append(dataHistoryEntry);
            });
            context.$('.data-action-info').on('click', function(event) {
                exposed.showDetailedInfo({
                    "datasetId": context.$(this).data('datasetid')
                });
            });
        }
    };

    function generateDataHistoryEntryRow(dataHistoryEntryObject) {
        return dataHistoryEntryTemplate({
            "datasetId": dataHistoryEntryObject.datasetId,
            "dataName": dataHistoryEntryObject.dataName,
            "dataDate": dataHistoryEntryObject.dataDate,
            "dataRecordCount": dataHistoryEntryObject.dataRecordCount
        });
    }

    return exposed;
});