define([
    './export-picker-publisher',
    'text!./export-picker-option.hbs',
    'text!./export-picker-layers.hbs',
    'text!./export-picker-simplified.hbs',
    'bootstrap',
    'handlebars'
], function (publisher, optionHBS, layersHBS) {

    var context,
        POINT_DESIGNATION = 'export-picker-singlePoint-modal',
        LAYER_DESIGNATION = 'export-picker-layer-modal',
        $modal,
        $picker,
        $simpleModal,
        $simplePicker,
        $closeButton,
        $exportButton,
        $layerList,
        currentDataSet,
        currentDataArray,
        layerRowTemplate;

    var exposed = {
        init: function(thisContext) {
            var optionTemplate = Handlebars.compile(optionHBS);
            layerRowTemplate = Handlebars.compile(layersHBS);

            context = thisContext;
            $modal = context.$('#export-picker-modal');
            $simpleModal = context.$('#export-picker-simplified-modal');
            $picker = $modal.find('#options');
            $simplePicker = $simpleModal.find('#options');
            $layerList = $modal.find('#layers');
            $exportButton = context.$('button[type="submit"]');
            $closeButton = context.$('button[type="cancel"]');
            $selectAll = context.$('input:checkbox[value=checkAll]');

            //no need to check if exports or options is available. Export toggle handles that logic.
            context.sandbox.export.options.forEach(function(option){
                var optionHTML = optionTemplate(option);
                $picker.append(optionHTML);
                $simplePicker.append(optionHTML);
            });

            $modal.modal({
                backdrop: true,
                keyboard: true,
                show: false
            }).on('hidden.bs.modal', function() {
                publisher.close();
                $('input[name=exportOption]:checkbox').removeAttr('checked');
            });

            $simpleModal.modal({
                backdrop: true,
                keyboard: true,
                show: false
            }).on('hidden.bs.modal', function() {
                publisher.close();
                $('input[name=exportOption]:checkbox').removeAttr('checked');
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
                $('input[name=exportOption]:checkbox').removeAttr('checked');
            });
 

            $closeButton.on('click', function(event) {
                event.preventDefault();
                context.$('input[name=exportOption]:checkbox').removeAttr('checked');
                publisher.close();
            });

            //select all logic. WILL NOT WORK consistently WITH .attr
            $selectAll.on('click', function(event) {
                if($selectAll.is(':checked')){
                    context.$('#layers input:checkbox').prop('checked', true);
                }
                else{
                    context.$('#layers input:checkbox').prop('checked', false);
                }
            });

            //hide info text found on the left side of the close and export buttons.
            context.$('.info-text').hide();
           
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
                $simpleModal.modal('show');


        
            }else if(params && params.layerId){
                //message came from timeline containing params.overlayId
                console.log("Layer list OVERLAY opening.");
                console.log("layerId: ", params.layerId)
                publisher.publishOpening({"componentOpening": LAYER_DESIGNATION});
                exposed.updateExportLayerList();
                //state is persisting even though element is set to true.
                //Forcing the element to show as selected when modal is opened.
                $selectAll.prop('checked', true);
                $modal.modal('show');

            }
            else{
                //its not a featureId or an overlayId. Open the layer view modal.
                console.log("Layer list ALL opening.");
                publisher.publishOpening({"componentOpening": LAYER_DESIGNATION});
                exposed.updateExportLayerList();
                //state is persisting even though element is set to true.
                //Forcing the element to show as selected when modal is opened.
                $selectAll.prop('checked', true);
                $modal.modal('show');

            }



        },
        close: function() {
            $modal.modal('hide');
            $simpleModal.modal('hide');
        },
        clear: function() {
            $modal.modal('hide');
            $simpleModal.modal('hide');
        },
        updateExportLayerList: function(){
            //clear old list of layers available.
            $layerList.html("");
            //it is assumed that dataStorage.datasets will always have at least one layer
            //since the component does not open without one.
            context.sandbox.util.each(context.sandbox.dataStorage.datasets, function(layerId, layerFeature){
                console.log("id: ", layerId); //id String
                console.log("feature: ", layerFeature); //actual object.

                var newAJAX = context.sandbox.utils.ajax({
                    type: 'GET',
                    url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/metadata/query/' + layerId,
                    xhrFields: {
                        withCredentials: true
                    }
                })
                .done(function(data) {
                    currentDataSet = {};
                    currentDataArray = [];

                    tempData = {
                        datasetId: data.queryId,
                        dataSessionId: data.sessionId,
                        dataSource: data.dataSource || 'N/A',
                        dataName: data.queryName || 'N/A',
                        dataRecordCount: data.numRecords || 'N/A',
                        rawDataObject: data.rawQuery || 'N/A'
                    };

                    console.log("Result: ", tempData);
                    var layerRowEntry = exposed.generateLayerRow(tempData);
                    $layerList.append(layerRowEntry);
                });


            });//end of the util.each
            
        },
        generateLayerRow: function(layerEntry){
            return layerRowTemplate ({
                "layerId": layerEntry.datasetId,
                "layerName": layerEntry.dataName,
                "dataSource": layerEntry.dataSource,
                "layerRecordCount": layerEntry.dataRecordCount
            });
        }
    };

    return exposed;

});