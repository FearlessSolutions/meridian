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
        selectedFeature,
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
                    selectedExportOption = getSelectedExportOption(),
                    featureId,
                    layerId;

                if(!selectedExportOption || selectedExportOption === ''){
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Export',
                        messageText: 'No export option selected.'
                    });
                } else if(selectedFeature){ //Is set on open
                    featureId = selectedFeature.featureId;
                    layerId = selectedFeature.layerId;

                    publisher.close(); //This resets selected feature
                    publisher.export({
                        channel: context.sandbox.export.options[selectedExportOption].channel,
                        featureId: featureId,
                        layerId: layerId
                    });
                } else if (!selectedLayers.length){
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Export',
                        messageText: 'No layer to export selected.'
                    });
                } else{
                    publisher.close();
                    publisher.export({
                        channel: context.sandbox.export.options[selectedExportOption].channel,
                        layerIds: selectedLayers
                    });
                }
            });





            $modal.find('input:radio[name=exportOption]').on('change', function(elll){
                var $this = context.$(this),
                    exportId = $this.val();

                $modal.find('.tab-pane').removeClass('active'); //Turn off any old ones
                $modal.find('#layer-tab-' + exportId).addClass('active');
            });

            $simpleModal.find('input:radio[name=exportOption]').on('change', function(elll){
                var $this = context.$(this),
                    exportId = $this.val();

                $simpleModal.find('.tab-pane').removeClass('active'); //Turn off any old ones
                $simpleModal.find('#point-tab-' + exportId).addClass('active');
            });




            $closeButton.on('click', function(event) {
                event.preventDefault();
                publisher.close();
            });

            //select all logic. WILL NOT WORK consistently WITH .attr
            $selectAll.on('change', function(event) {
                if($selectAll.is(':checked')){
                    context.$('#layers input:checkbox').prop('checked', true);
                }
                else{
                    //don't change this to removeProp.
                    context.$('#layers input:checkbox').prop('checked', false);
                }
                validateLayers();
            });

            //hide info text found on the left side of the close and export buttons.
            context.$('.info-text').hide();
           
        },
        open: function(params) {
            context.$('.tab-pane').removeClass('active'); //Turn off old panes //TODO check on this

            if(params && params.featureId && params.layerId){ //It is a point
                selectedFeature = {
                    featureId: params.featureId,
                    layerId: params.layerId
                };

                publisher.publishOpening({
                    componentOpening: POINT_DESIGNATION
                });

                validateFeature({
                    featureId: params.featureId,
                    layerId: params.layerId
                });

                $simpleModal.modal('show');
            }else if(params && params.layerId){ //It is a specific layer
                //message came from timeline containing params.overlayId
                publisher.publishOpening({
                    componentOpening: LAYER_DESIGNATION
                });
                exposed.updateExportLayerList();
                $selectAll.removeProp('checked');
                $selectAll.change(); //Run event

                context.$('.data-checkbox input[value=' + params.layerId +']').prop('checked', true);
                validateLayers();

                $modal.modal('show');
            } else{ //It is all layers
                //its not a featureId or an overlayId. Open the layer view modal.
                publisher.publishOpening({
                    componentOpening: LAYER_DESIGNATION
                });
                exposed.updateExportLayerList();
                //state is persisting even though element is set to checked.
                //Forcing the element to show as selected when modal is opened.
                $selectAll.prop('checked', true);
                $selectAll.change(); //Run event

                $modal.modal('show');
            }
        },
        close: function() {
            $modal.modal('hide');
            $simpleModal.modal('hide');
            context.$('.export-options input').prop('checked', false); //Uncheck all options from both modals
            selectedFeature = null;
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
                validateLayers();
            });

        }
    };

    function validateFeature(params){
        var featureId = params.featureId,
            layerId = params.layerId;

        context.sandbox.utils.each(context.sandbox.export.validate, function(exportId, validateFunction){
            var setExportOption = function(valid){
                if(valid){
                    enableExportOption(exportId, 'point');
                }else{
                    disableExportOption(exportId, 'point');
                }
            };

            validateFunction({
                featureId: featureId,
                layerId: layerId,
                callback: setExportOption
            });
        });
    }

    function validateLayers(){
        var selectedLayers = getSelectedLayers();

        context.sandbox.utils.each(context.sandbox.export.validate, function(exportId, validateFunction){
            var setExportOption = function(valid){
                if(valid){
                    enableExportOption(exportId, 'layer');
                }else{
                    disableExportOption(exportId, 'layer');
                }
            };

            validateFunction({
                layerIds: selectedLayers,
                callback: setExportOption
            });
        });
    }

    function disableExportOption(exportId, type){
        var exportRadioDiv = context.$('#' + type+'-export-'+ exportId);
        exportRadioDiv.hide();//.addClass('disabled');
        exportRadioDiv.find(':radio').prop('disabled', true);

    }
    function enableExportOption(exportId, type){
        var exportRadioDiv = context.$('#' + type + '-export-'+ exportId),
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
        return context.$('.export-options input:checked').val();
    }

    return exposed;

});