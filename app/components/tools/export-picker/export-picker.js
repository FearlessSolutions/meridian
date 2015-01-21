//TODO
//-add hooks to tabs
//-find out how to do views
//-make simple view work
//-colors

define([
    './export-picker-publisher',
    'text!./export-picker-layers.hbs',
    'text!./export-picker-simplified.hbs',
    'bootstrap',
    'handlebars'
], function (publisher, layersHBS) {

    var context,
        $modal,
        $simpleModal,
        $closeButton,
        $exportButton,
        $layerList,
        selectedFeature,
        $selectAll,
        layerListTemplate,
        $layerContainer,
        $exportContainer,
        $extraContainer,
        $layerTab,
        $extraTab;

    var exposed = {
        init: function(thisContext) {
            layerListTemplate = Handlebars.compile(layersHBS);
            context = thisContext;
            $modal = context.$('#export-picker-modal');
            $layerContainer = $modal.find('#layer-container'); //TODO Move or remove
            $exportContainer = $modal.find('#export-container');
            $extraContainer = $modal.find('#extra-export-container');
            $layerList = $layerContainer.find('#layer-options');
            $selectAll = $layerContainer.find('input:checkbox[value=checkAll]');

            $layerTab = $modal.find('#layer-tab-col');
            $extraTab = $modal.find('#extra-export-tab-col');

            $exportButton = $modal.find('button[type="submit"]');
            $closeButton = $modal.find('button[type="cancel"]');

            $modal.modal({
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

            $exportContainer.find('input:radio[name=exportOption]').on('change', function(){
                var $this = context.$(this),
                    exportId = $this.val(),
                    $exportTab = $extraContainer.find('#tab-' + exportId);
                $exportContainer.find('.radio').removeClass('selected');
                $this.parent().parent().addClass('selected');


                if($exportTab.length){
                    toOptionsMode($exportTab);
                } else {
                    toLayerMode();
                }
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
                    context.$('#layer-options input:checkbox').prop('checked', false);
                }
                validateLayers();
            });

            //hide info text found on the left side of the close and export buttons.
            context.$('.info-text').hide();
           
        },
        open: function(params) {
            $extraContainer.find('.tab-pane').removeClass('active'); //Turn off old panes

            if(params && params.featureId && params.layerId){ //It is a point
//                selectedFeature = {
//                    featureId: params.featureId,
//                    layerId: params.layerId
//                };
//
//                publisher.publishOpening({
//                    componentOpening: POINT_DESIGNATION
//                });
//
//                validateFeature({
//                    featureId: params.featureId,
//                    layerId: params.layerId
//                });
//
//                $simpleModal.modal('show');
            }else if(params && params.layerId){ //It is a specific layer
                //message came from timeline containing params.overlayId
                publisher.publishOpening({
                    componentOpening: '' //LAYER_DESIGNATION //TODO what to do with this?
                });
                exposed.updateExportLayerList();
                $selectAll.removeProp('checked');
                $selectAll.change(); //Run event

                $layerContainer.find('.data-checkbox input[value=' + params.layerId +']').prop('checked', true);
                validateLayers();
                toLayerMode(true);

                $modal.modal('show');
            } else{ //It is all layers
                //its not a featureId or an overlayId. Open the layer view modal.
                publisher.publishOpening({
                    componentOpening: '' //LAYER_DESIGNATION //TODO what to do with this?
                });
                exposed.updateExportLayerList();
                //state is persisting even though element is set to checked.
                //Forcing the element to show as selected when modal is opened.
                $selectAll.prop('checked', true);
                $selectAll.change(); //Run event

                toLayerMode();
                $modal.modal('show');
            }
        },
        close: function() {
            $modal.modal('hide');
            $simpleModal.modal('hide');
            context.$('.export-options input').prop('checked', false); //Uncheck all options from both modals
            selectedFeature = null;
            //TODO unselect export option parent
        },
        clear: function() {
            $modal.modal('hide');
            $simpleModal.modal('hide');
        },
        updateExportLayerList: function(){
            var layerList = [];

            //It is assumed that dataStorage.datasets will always have at least one layer
            //since the component does not open without one.
            context.sandbox.util.each(context.sandbox.dataStorage.datasets, function(layerId, layerInfo){
                layerList.push({
                    layerId: layerId,
                    layerName: layerInfo.layerName,
                    dataSource: layerInfo.dataService,
                    count: layerInfo.length
                });
            });//end of the util.each
            $layerList.html(layerListTemplate({
                layers: layerList
            }));

            //Apply update logic to layer checkboxs
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
                    enableExportOption(exportId);
                }else{
                    disableExportOption(exportId);
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
    }

    function disableExportOption(exportId){
        var exportRadioDiv = $extraContainer.find('#export-'+ exportId);
        exportRadioDiv.hide();//.addClass('disabled');
        exportRadioDiv.find(':radio').prop('disabled', true);

    }
    function enableExportOption(exportId, type){
        var exportRadioDiv = $extraContainer.find('#export-'+ exportId),
            exportRadio = exportRadioDiv.find(':radio');

        exportRadioDiv.show();//.addClass('disabled');
        exportRadio.prop('disabled', false);
        exportRadio.prop('checked', false);
    }

    function getSelectedLayers(){
        return $layerContainer.find('.data-checkbox input:checked').map(function () {
            return this.value;
        }).get();
    }

    function getSelectedExportOption(){
        return $exportContainer.find('.export-options input:checked').val();
    }

    function toLayerMode(disableOptions){
        $extraContainer.find('.tab-pane').removeClass('active'); //Turn off any old ones
        $extraContainer.addClass('hidden');
        $layerContainer.removeClass('hidden');
        if(disableOptions){
            $extraTab.addClass('disabled');
        }
    }

    function toOptionsMode($tab, disableLayers){
        $extraContainer.find('.tab-pane').removeClass('active'); //Turn off any old ones
        $layerContainer.addClass('hidden');
        $extraContainer.removeClass('hidden');
        $tab.addClass('active');

        if(disableLayers){
            $layerTab.addClass('disable');
        }
    }

    function toFeatureMode(){
        $layerContainer.addClass('hidden');
        //TODO something about tab?
    }
    return exposed;

});
