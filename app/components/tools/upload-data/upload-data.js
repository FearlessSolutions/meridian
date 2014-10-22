/**
 * Applies handlers to buttons
 * Gets and checks the disk file
 * Runs the upload
 * Sends everything to the map
 */
define([
    './upload-data-publisher',
    'bootstrap',
    'bootstrapDialog',
    'jqueryDrag',
    'handlebars'
], function (publisher) {
    var context,
        MENU_DESIGNATION = "upload-data",
        DATASOURCE_NAME = "UPLOADED_FILE",
        $dialog,
        $file,
        $dummyFile,
        $classification,
        $submit;

    var exposed = {
        "init": function(thisContext) {
            context = thisContext;
            $dialog = context.$('#uploadDataDialog');
            $file = context.$('#file');
            $dummyFile = context.$('#dummy-file');
            $classification = context.$('#classification');
            $submit = context.$('#upload-submit');

            $submit.attr('disabled', true); //Start with submit disabled until a file is added

            //Toggle the menu on UI click
            context.$('#uploadData').on('click', function(event){
                event.preventDefault();
                $dialog.dialog('toggle');
            });

            //When the menu is opened, let the app know
            $dialog.on('shown.bs.dialog', function(){
                publisher.publishOpening({"componentOpening": MENU_DESIGNATION});
            });

            //Tie the hidden <file> input with the pretty UI one
            context.$('#open-file').on('click', function(){
                $file.click();
            });

            //When a file is selected, check that it is a CSV file and
            //update the UI if there is an error
            $file.on('change', function(){
                var file = context.$(this)[0].files[0],
                    fileExtension,
                    isValidFileExtension = false;
                $dummyFile.val(context.$(this).val());

                if(file){
                    fileExtension = context.sandbox.utils.getFileExtension(file);
                    context.sandbox.utils.each(context.sandbox.dataServices[DATASOURCE_NAME].configuration.filetypes,
                        function(filetype, filetypeProperties){
                            if(filetype === fileExtension){
                                isValidFileExtension = true;
                            }
                    });

                    if(isValidFileExtension){
                        removeFileError();
                        $submit.attr('disabled', false);
                    }else{
                        setFileError();
                        $submit.attr('disabled', true);
                    }
                }else{
                    removeFileError(); //'no file' is valid, or at least not an error
                    $submit.attr('disabled', true);
                }
            });

            //Handle submit
            $submit.on('click', function(){
                //Get the file from the input
                var file = $file[0].files[0],
                    filetype,
                    classification,
                    queryId,
                    queryName,
                    newAJAX;

                //TODO handle multiple files?
                if(file){
                    queryId = context.sandbox.utils.UUID();
                    queryName = file.name; //Use the file name as the query name
                    filetype = context.sandbox.utils.getFileExtension(file);
                    classification = $classification.val();

                    //Create a new collection for the data
                    context.sandbox.dataStorage.datasets[queryId] = new Backbone.Collection();
                    context.sandbox.dataStorage.datasets[queryId].dataService = DATASOURCE_NAME;

                    publisher.createLayer({
                        "layerId": queryId,
                        "name": queryName,
                        "selectable": true
                    });

                    publisher.addToProgressQueue();

                    publisher.publishMessage({
                        "messageType": "success",
                        "messageTitle": "Data Upload",
                        "messageText": "Data upload was started."
                    });

                    // Try the upload
                    newAJAX = context.sandbox.upload.file(
                        {
                            "queryId": queryId,
                            "queryName": queryName,
                            "file": file,
                            "filetype": filetype,
                            "classification": classification
                        },
                        //Success callback
                        function(data){
                            publishData(data, queryId, queryName);
                        },
                        //Error callback
                        function(status, jqXHR){
                            publishError(queryId, queryName);
                        }
                    );

                    context.sandbox.ajax.addActiveAJAX({
                        "newAJAX": newAJAX,
                        "layerId": queryId
                    });

                    context.sandbox.stateManager.setLayerStateById({
                        "layerId": queryId,
                        "state": {
                            "dataTransferState": 'running'
                        }
                    });

                    close();
                }
            });

            context.$('#upload-cancel').on('click', close); //Handle close
            close();
        },
        "handleMenuOpening": function(args){
            if(args.componentOpening === MENU_DESIGNATION){
                return;
            }else{
                close();
            }
        },
        "stopQuery": function(params){
            var layerState,
                dataTransferState;

            //If the query is not related to this datasource, ignore
            if(context.sandbox.dataStorage.datasets[params.layerId].dataService !== DATASOURCE_NAME){
                return;
            }

            context.sandbox.ajax.stopQuery({
                "layerId": params.layerId
            });

            // Handle notifcations and state
            layerState = context.sandbox.stateManager.getLayerStateById({"layerId": params.layerId});
            if(layerState) {
                // Check state manager for status of layer, if already stopped or finished don't publish message or change state
                dataTransferState = layerState.dataTransferState;

                if(dataTransferState !== 'stopped' && dataTransferState !== 'finished') {
                    publisher.publishMessage({
                        "messageType": "warning",
                        "messageTitle": "Data Service",
                        "messageText": "Query data transfer was stopped."
                    });

                    publisher.removeFromProgressQueue();

                    context.sandbox.stateManager.setLayerStateById({
                        "layerId": params.layerId,
                        "state": {
                            "dataTransferState": 'stopped'
                        }
                    });
                }
            }
        },
        "clear": function() {
            var queryId;
            $dummyFile.val('');
            $submit.attr('disabled', true);

            //TODO check for datasource
            //TODO handle AJAX
            for(queryId in context.sandbox.dataStorage.datasets){
                if(context.sandbox.dataStorage.datasets[queryId].dataService === DATASOURCE_NAME){
                    delete context.sandbox.dataStorage.datasets[queryId];
                }
            }
        }
    };

    return exposed;

    function close(){
        $dialog.dialog('hide');
    }

    function removeFileError(){
        $dummyFile.parent().removeClass('has-error');
    }

    function setFileError(){
        publisher.publishMessage({
            "messageType": "warning",
            "messageTitle": "Data Upload",
            "messageText": "File type not supported for upload"
        });

        $dummyFile.parent().addClass('has-error');
    }

    function publishData(data, queryId, queryName){
        var chunk = [],
            chunks = [],
            chunksIndex = 0;
            CHUNK_SIZE = 1000;

        if(data.length === 0){
            publishFinished(queryId, queryName);
            return;
        }

        data.forEach(function(feature, index){
            var newValue;

            data[index].dataService = DATASOURCE_NAME;

            //No keys, so skip that step
            newValue = {
                "dataService": DATASOURCE_NAME,
                "layerId": queryId,
                "id": feature.properties.featureId,
                "featureId": feature.properties.featureId,
                "geometry": feature.geometry,
                "type": feature.type,
                "properties" : {},
                "lat": feature.geometry.coordinates[1],
                "lon": feature.geometry.coordinates[0]
            };

            context.sandbox.dataStorage.addData({
                "datasetId": queryId,
                "data": newValue
            });

            // Add style properties for map features, but not for local dataset storage
            context.sandbox.utils.each(context.sandbox.icons.getIconForFeature(feature), function(styleKey, styleValue){
                newValue.properties[styleKey] = styleValue;
            });

            chunk.push(newValue);

            // Deal with chunk state
            if((index % CHUNK_SIZE) === 0){
                chunks.push(chunk);
                chunksIndex++;
                chunk = [];
            }
        });

        //Push remaining values into chunk array. This might be an empty array, but that is ok.
        chunks.push(chunk);

        console.debug("Ready to publish", data.length);
        console.debug("chunks", chunks.length);


        //Publish the data, one chunk at a time
        for(chunksIndex = 0; chunksIndex < chunks.length; chunksIndex++){
            console.debug("publishing ", chunksIndex);
            chunk = chunks[chunksIndex];
            publisher.publishData({
                "layerId": queryId,
                "data": chunk
            });

            publisher.publishMessage({
                "messageType": "info",
                "messageTitle": "Data Upload",
                "messageText": chunk.length + " events have been added to the " + queryName + " layer."
            });
        }

        publishFinished(queryId, queryName);
    }



    function publishFinished(queryId, queryName){
        publisher.removeFromProgressQueue();

        publisher.publishMessage({
            "messageType": "success",
            "messageTitle": "Data Upload",
            "messageText": queryName + " Upload Complete"
        });

        publisher.publishFinished({"layerId": queryId});
    }

    function publishError(queryId, queryName){
        publisher.removeFromProgressQueue();

        //If the error was because we aborted, ignore
        if(e.statusText === "abort"){
            return;
        }

        publisher.publishMessage({
            "messageType": "error",
            "messageTitle": "Data Upload",
            "messageText": "Connection to upload service failed for " + queryName
        });

        context.sandbox.stateManager.setLayerStateById({
            "layerId": queryId,
            "state": {
                "dataTransferState": 'error'
            }
        });

        publisher.publishError({
            "layerId": queryId
        });

        return false;
    }

});