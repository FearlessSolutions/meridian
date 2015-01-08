define([
    './export-picker-publisher',
    'text!./export-picker-option.hbs',
    'text!./export-picker-layers.hbs',
    'bootstrap',
    'handlebars'
], function (publisher, optionHBS, layersHBS) {

    var context,
        POINT_DESIGNATION = 'export-picker-singlePoint-modal',
        LAYER_DESIGNATION = 'export-picker-layer-modal',
        $modal,
        $picker,
        $closeButton,
        $exportButton,
        currentDataSet,
        currentDataArray;

    var exposed = {
        init: function(thisContext) {
            var optionTemplate = Handlebars.compile(optionHBS);

            context = thisContext;
            $modal = context.$('#export-picker-modal');
            $picker = $modal.find('#options');
            $layerList = $modal.find('#exportLayers');
            $exportButton = context.$('button[type="submit"]');
            $closeButton = context.$('button[type="cancel"]');

            context.sandbox.exportOps.forEach(function(option){
                var optionHTML = optionTemplate(option);
                $picker.append(optionHTML);
            });

            $modal.modal({
                backdrop: true,
                keyboard: true,
                show: false
            }).on('hidden.bs.modal', function() {
                publisher.close();
                $('input:checkbox').removeAttr('checked');
            });

            $exportButton.on('click', function(){

                var selectedExports = context.$("input[name=exportOption]:checked").map(
                    function () {return this.value;}).get().join(",");
                var selectedExportsList = selectedExports.split(",");

               if(selectedExportsList[0] === ""){
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Export',
                        messageText: 'No export option selected.'
                    });
                    return;
                }
                else{
                    context.sandbox.utils.each(selectedExportsList, function(idx, destination){
                        context.sandbox.exports.sendFeaturesTo(destination,  function(status){
                            publisher.publishMessage({
                                messageType: status.messageType,
                                messageTitle: 'Export',
                                messageText: status.messageText
                            });
                            return;
                        });
                    });
                }
                publisher.close();
                $('input:checkbox').removeAttr('checked');
            });
 

            $closeButton.on('click', function(event) {
                event.preventDefault();
                context.$('input:checkbox').removeAttr('checked');
                publisher.close();
            });
           
        },
        open: function(params) {
            console.log("dataSets",context.sandbox.dataStorage.datasets);
            context.sandbox.util.each(context.sandbox.dataStorage.datasets, function(layerId, layerFeature){
                console.log("id: ", layerId);
                console.log("feature: ", layerFeature);
            });
            if(params && params.featureId){
                //params can have featureId or overlayId.
                
                console.log("Single point opening.");
                publisher.publishOpening({"componentOpening": POINT_DESIGNATION});
        
            }else if(params && params.layerId){
                //message came from timeline containign params.overlayId
                console.log("Layer list OVERLAY opening.");
                console.log("layerId: ", params.layerId)
                publisher.publishOpening({"componentOpening": LAYER_DESIGNATION});

            }
            else{
                //its not a featureId or an overlayId. Open the layer view modal.
                console.log("Layer list ALL opening.");
                publisher.publishOpening({"componentOpening": LAYER_DESIGNATION});
        

            }


            $modal.modal('show');
        },
        close: function() {
            $modal.modal('hide');
        },
        clear: function() {
            $modal.modal('hide');
        },
        updateExportLayerList: function(){
            var newAJAX = context.sandbox.utils.ajax({
                type: 'GET',
                url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/metadata/query/' + dataObject.datasetId,
                xhrFields: {
                    withCredentials: true
                }
            })
            .done(function(data) {
                currentDataSet = {};
                currentDataArray = [];

                var now = moment(), //This needs to be done now to prevent race condition later
                    dataDate = moment.unix(data.createdOn),
                    expireDate = moment.unix(data.expireOn),
                    isExpired = expireDate.isBefore(now),
                    disableRestore = isExpired, //Use this as default
                    tempData,
                    rawDataObjectString,
                    dataHistoryDetailView,
                    dataStatus = isExpired ? 'Expired' : 'N/A';

                tempData = {
                    datasetId: data.queryId,
                    dataSessionId: data.sessionId,
                    dataSource: data.dataSource || 'N/A',
                    dataName: data.queryName || 'N/A',
                    dataRecordCount: data.numRecords || 'N/A',
                    rawDataObject: data.rawQuery || 'N/A'
                };
            });
        }
    };

    return exposed;

});