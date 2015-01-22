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
        selectedFeature,
        layerListTemplate,
        $modal,
        $layerList,
        $selectAll,
        $layerContainer,
        $exportContainer,
        $extraContainer,
        $layerTab,
        $layerTabBox,
        $extraTab,
        $extraTabBox;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            selectedFeature = null;
            layerListTemplate = Handlebars.compile(layersHBS);

            $modal = context.$('#export-picker-modal');

            //Layer objects
            $layerTab = $modal.find('#layer-tab-col');
            $layerTabBox = $layerTab.find('#layer-tab');
            $layerContainer = $modal.find('#layer-container'); //TODO Move or remove
            $layerList = $layerContainer.find('#layer-options');
            $selectAll = $layerContainer.find('input:checkbox[value=checkAll]');

            //Export objects
            $exportContainer = $modal.find('#export-container');

            //Extra options objects
            $extraTab = $modal.find('#extra-export-tab-col');
            $extraTabBox = $extraTab.find('#extra-export-tab');
            $extraContainer = $modal.find('#extra-export-container');

            $modal.modal({
                backdrop: true,
                keyboard: true,
                show: false
            }).on('hidden.bs.modal', function() {
                publisher.close();
            });

            //Export button
            $modal.find('.modal-footer button[type="submit"]').on('click', function(){ //TODO get values, verify
                var selectedLayers = getSelectedLayers(),
                    selectedExportOption = getSelectedExportOption(),
                    extraFields = getExtraFields(selectedExportOption),
                    featureId,
                    layerId,
                    publishCallback;

                publishMessageCallback = function(callbackParams){
                    publisher.publishMessage({
                        messageType: callbackParams.messageType,
                        messageTitle: callbackParams.messageTitle,
                        messageText: callbackParams.messageText
                    });
                };

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
                    context.sandbox.export.export[selectedExportOption]({
                        featureId: featureId,
                        layerId: layerId,
                        options: extraFields,
                        callback: publishMessageCallback
                    });
                } else if (!selectedLayers.length){
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Export',
                        messageText: 'No layer to export selected.'
                    });
                } else{
                    publisher.close();
                    context.sandbox.export.export[selectedExportOption]({
                        layerIds: selectedLayers,
                        options: extraFields,
                        callback: publishMessageCallback
                    });
                }
            });

            //Close button
            $modal.find('.modal-footer button[type="cancel"]').on('click', function(event) {
                event.preventDefault();
                publisher.close();
            });

            //Hide/show functionality for tabs
            $layerTabBox.on('click', function(){
                if(!$layerTabBox.hasClass('disabled')){
                    hideExtraOptions();
                    showLayers();
                }
            });
            $extraTabBox.on('click', function(){
                if(!$extraTabBox.hasClass('disabled')) {
                    hideLayers();
                    showExtraOptions();
                }
            });

            //select all logic. WILL NOT WORK consistently WITH .attr
            $selectAll.on('change', function(event) {
                if($selectAll.is(':checked')){
                    $layerList.find('input.layer-checkbox').prop('checked', true);
                }
                else{
                    //don't change this to removeProp.
                    $layerList.find('input.layer-checkbox').prop('checked', false);
                }
                validateLayers();
            });

            //Export radio buttons. These don't get removed, so can do up here.
            $exportContainer.find('input:radio[name=exportOption]').on('change', function(){
                var $this = context.$(this),
                    exportId = $this.val(),
                    enabledExtraOptions;

                $exportContainer.find('.radio').removeClass('selected');
                $this.parent().parent().addClass('selected'); //TODO does 'selected' do anything anymore?
                enabledExtraOptions = enableExtraOptions(exportId);

                if(isInExpandedMode()){ //In expanded mode
                    if (enabledExtraOptions) { //Decide if layers should be shown
                        disableLayers(false);
                    }else {
                        enableLayers();
                    }
                }
            });

            //hide info text found on the left side of the close and export buttons.
            context.$('.info-text').hide(); //TODO info text anymore?
           
        },
        open: function(params) {
            clean();

            if(params && params.featureId && params.layerId){ //It is a point
                selectedFeature = {
                    featureId: params.featureId,
                    layerId: params.layerId
                };

                publisher.publishOpening({
                    componentOpening: '' //POINT_DESIGNATION //TODO what to do with this?
                });

                validateFeature({
                    featureId: params.featureId,
                    layerId: params.layerId
                });

                show();
            }else if(params && params.layerId){ //It is a specific layer
                //message came from timeline containing params.overlayId
                publisher.publishOpening({
                    componentOpening: '' //LAYER_DESIGNATION //TODO what to do with this?
                });
                exposed.updateExportLayerList();
                $selectAll.change(); //Run none selected event

                $layerContainer.find('.layer-option input[value=' + params.layerId +']').prop('checked', true);
                validateLayers();

                show();
            } else{ //It is all layers
                publisher.publishOpening({
                    componentOpening: '' //LAYER_DESIGNATION //TODO what to do with this?
                });
                exposed.updateExportLayerList();
                //state is persisting even though element is set to checked.
                //Forcing the element to show as selected when modal is opened.
                $selectAll.prop('checked', true);
                $selectAll.change(); //Run event

                show();
            }
        },
        close: function() {
            $modal.modal('hide');
            selectedFeature = null;
            clean();
        },
        clear: function() {
            exposed.close();
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

    function show(){
        disableExtraOptions(true);

        if(isInExpandedMode()){
            enableLayers();
        } else {
            disableLayers(true)
        }

        $modal.modal('show');
    }

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
        var exportRadioDiv = $exportContainer.find('#export-'+ exportId);
        exportRadioDiv.hide();
        exportRadioDiv.find(':radio').prop('disabled', true);

    }
    function enableExportOption(exportId, type){
        var exportRadioDiv = $exportContainer.find('#export-'+ exportId),
            exportRadio = exportRadioDiv.find(':radio');

        exportRadioDiv.show();
        exportRadio.prop('disabled', false);
        exportRadio.prop('checked', false);
    }

    function getSelectedLayers(){
        return $layerList.find('input.layer-checkbox:checked').map(function () {
            return this.value;
        }).get();
    }

    function getSelectedExportOption(){
        return $exportContainer.find('#export-options input:checked').val();
    }

    function clean(){
        $selectAll.removeProp('checked');
        $layerContainer.find('.layer-option input').prop('checked', false);


        $exportContainer.find('.radio').removeClass('selected');
        //TODO remove parent.parent selected?
        disableExtraOptions(true);
    }

    function isInExpandedMode(){
        return selectedFeature === null
    }

    function enableLayers(){
        $layerTabBox.removeClass('disabled');
        showLayers();
    }
    function disableLayers(disableTab){
        if(disableTab){
            $layerTabBox.addClass('disabled');
        }
        hideLayers();
    }
    function showLayers(){
        $layerContainer.show();
    }
    function hideLayers(){
        $layerContainer.hide();
    }

    function enableExtraOptions(exportId){
        var $exportPane = $extraContainer.find('#tab-' + exportId);

        $extraContainer.find('.tab-pane').removeClass('active'); //Turn off any old ones
        $extraTabBox.text(context.sandbox.export.options[exportId].label + ' Options');

        if($exportPane.length) { //Check if there is a pane for the export id
            $exportPane.addClass('active');
            $extraTabBox.removeClass('disabled');
            showExtraOptions();

            return true;
        }else{
            disableExtraOptions(false); //Don't remove the text, but disable the tab

            return false;
        }
    }
    function disableExtraOptions(clearText){ //TODO figure out how to determine if I should open layers
        $extraContainer.find('.tab-pane').removeClass('active'); //Turn off any old ones

        if(clearText){
            $extraTabBox.text('Extra Options (none)');
        }
        $extraTabBox.addClass('disabled');
        hideExtraOptions();
    }
    function showExtraOptions(){
        $extraContainer.show();
    }
    function hideExtraOptions(){
        $extraContainer.hide();
    }

    function getExtraFields(exportId){
        //Collect all (if any inputs in the export option's pane
        var $inputs = $extraContainer.find('#tab-' + exportId + ' input'),
            fieldValueMap = {};

        $inputs.each(function(){
            var $this = context.$(this);
            fieldValueMap[$this.data('field')] = $this.val();
        });

        return fieldValueMap;
    }

    return exposed;

});
