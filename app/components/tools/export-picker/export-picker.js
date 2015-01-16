define([
    './export-picker-publisher',
    'text!./export-picker-layers.hbs',
    'text!./export-picker-simplified.hbs',
    'bootstrap',
    'handlebars'
], function (publisher, layersHBS) {

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
        currentLayerNameMap = {},
        layerRowTemplate,
        $selectAll,
        layerRowTemplate;

    var exposed = {
        init: function(thisContext) {
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

            $modal.modal({
                backdrop: true,
                keyboard: true,
                show: false
            }).on('hidden.bs.modal', function() {
                publisher.close();
            });

            $simpleModal.modal({
                backdrop: true,
                keyboard: true,
                show: false
            }).on('hidden.bs.modal', function() {
                publisher.close();
            });

            $exportButton.on('click', function(){
                var selectedLayers = getSelectedLayers(),
                    selectedExportOption = getSelectedExportOption();

                if(!selectedExportOption || selectedExportOption === ''){
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Export',
                        messageText: 'No export option selected.'
                    });
                    return;
                }else if (!selectedLayers || selectedLayers === ''){
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Export',
                        messageText: 'No layer to export selected.'
                    });
                    return;
                } else{
                    publisher.close();
                    publisher.export({
                        channel: context.sandbox.export.options[selectedExportOption].channel,
                        layerIds: selectedLayers
                    });
                }
            });

            $closeButton.on('click', function(event) {
                event.preventDefault();
                publisher.close();
            });

            //TODO
            //select all logic. WILL NOT WORK consistently WITH .attr
            $selectAll.on('change', function(event) {
                if($selectAll.is(':checked')){
                    context.$('#layers input:checkbox').prop('checked', true);
                }
                else{
                    //don't change this to removeProp.
                    context.$('#layers input:checkbox').prop('checked', false);
                }
                exposed.validateLayers();
            });

            //hide info text found on the left side of the close and export buttons.
            context.$('.info-text').hide();
           
        },
        open: function(params) {
            // console.log("dataSets",context.sandbox.dataStorage.datasets);
            // context.sandbox.util.each(context.sandbox.dataStorage.datasets, function(layerId, layerFeature){
            //     console.log("id: ", layerId);
            //     console.log("feature: ", layerFeature);
            // });
            if(params && params.featureId){
                //params can have featureId or overlayId.
                publisher.publishOpening({
                    componentOpening: POINT_DESIGNATION
                });

                $simpleModal.modal('show');
        
            }else if(params && params.layerId){
                //message came from timeline containing params.overlayId
                publisher.publishOpening({
                    componentOpening: LAYER_DESIGNATION
                });
                exposed.updateExportLayerList();
                $selectAll.removeProp('checked');
                

                $modal.modal('show');

            }
            else{
                //its not a featureId or an overlayId. Open the layer view modal.
                //console.log("Layer list ALL opening.");
                publisher.publishOpening({
                    componentOpening: LAYER_DESIGNATION
                });
                exposed.updateExportLayerList();
                //state is persisting even though element is set to checked.
                //Forcing the element to show as selected when modal is opened.
                $selectAll.prop('checked', true);
                $selectAll.change();
                $modal.modal('show');
            }
        },
        close: function() {
//            $modal.modal('hide');
//            $simpleModal.modal('hide');
//            $('input[name=exportOption]:checkbox').removeProp('checked');
        },
        clear: function() {
            $modal.modal('hide');
            $simpleModal.modal('hide');
        },
        updateExportLayerList: function(){
            //Clear old list of layers available.
            $layerList.empty();

            //It is assumed that dataStorage.datasets will always have at least one layer
            //since the component does not open without one.
            context.sandbox.util.each(context.sandbox.dataStorage.datasets, function(layerId, layerInfo){
                currentLayerNameMap[layerId] = layerInfo.layerName;
                $layerList.append(layerRowTemplate({
                    layerId: layerId,
                    dataSource: layerInfo.dataService,
                    layerName: layerInfo.layerName,
                    featureCount: layerInfo.length
                }));
            });//end of the util.each

            var box = context.$('.data-checkbox input:checkbox');

            context.$('.data-checkbox input:checkbox').on('change',function(){
                $selectAll.prop('checked', false);
                exposed.validateLayers();
            });

        },
        validateFeatures: function(type){
//            var listToExport = [];
//            context.sandbox.util.each(selectedLayerList, function(index, selectedLayerId){
//                var dataSet = context.sandbox.dataStorage.datasets[selectedLayerId];
//                //validate each dataSet. error callback if the dataSet can be sent to the selectedOption
//                context.sandbox.dataServices[dataSet.dataService].validateForExport(selectedOption, function(status){
//                    if(status.result == true){
//                        listToExport.push(dataSet);
//                    }
//                    else{
//                        var errorMessage = "Layer " + currentLayerNameMap[selectedLayerId] +
//                                " cannot be exported to: " + selectedOption
//                        publisher.publishMessage({
//                            messageType: 'error',
//                            messageTitle: 'Export',
//                            messageText: errorMessage
//                        });
//                    }
//                });
//            });
//            return listToExport;
        },
        validateLayers: function(){
            var selectedLayers = getSelectedLayers();

            context.sandbox.utils.each(context.sandbox.export.validate, function(exportId, validateFunction){
                var setExportOption = function(valid){
                    if(valid){
                        enableExportOption(exportId);
                    }else{
                        disableExportOption(exportId);
                    }
                };

                validateFunction({
                    layerIds: selectedLayers,
                    callback: setExportOption
                });
            });
        },
        //listToExport is an arrray of objects. Those objects are dataSets (layer Backbone collection)
        sendToExport: function(content, selectedOption){
            //remember to send list like an object so we cna re-use this function with single points.
            //{layer: content} or {point: content}
            console.log("Completed. Sending to " + selectedOption + "", content);

            //selectedOption will tell you which sandbox export to use
            //the sandbox export function (csv,kml) handles if its an layer or a single point.
        }
    };

    function disableExportOption(exportId){
        var exportRadioDiv = context.$('#export-'+ exportId);
        exportRadioDiv.hide();//.addClass('disabled');
        exportRadioDiv.find(':radio').prop('disabled', true);

    }
    function enableExportOption(exportId){
        var exportRadioDiv = context.$('#export-'+ exportId),
            exportRadio = exportRadioDiv.find(':radio');

        exportRadioDiv.show();//.addClass('disabled');
        exportRadio.prop('disabled', false);
        exportRadio.prop('checked', false);

    }

    function getSelectedLayers(){
        return context.$('.data-checkbox input:checked').map(function () {
            return this.value;
        }).get();
    }

    function getSelectedExportOption(){
        return context.$('#export-options input:checked').val();
    }

    return exposed;

});