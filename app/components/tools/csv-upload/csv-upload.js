/**
 * Applies handlers to buttons
 * Gets and checks the disk file
 * Runs the upload
 * Sends everything to the map
 */
define([
    './csv-upload-publisher',
    'bootstrap',
    'bootstrapDialog',
    'jqueryDrag',
    'handlebars'
], function (publisher) {
    var context,
        MENU_DESIGNATION = "CSV upload",
        DATASOURCE_NAME = "UPLOADED_CSV",
        $dialog,
        $file,
        $dummyFile,
        $submit,
        openAjaxs;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $dialog = context.$('#csvDialog');
            $file = context.$('#file');
            $dummyFile = context.$('#dummy-file');
            $submit = context.$('#upload-submit');
            openAjaxs = [];

            $submit.attr('disabled', true); //Start with submit disabled until a file is added

            //Toggle the menu on UI click
            context.$('#csv').on('click', function(event){
                event.preventDefault();
                $dialog.dialog('toggle');
            });

            //When the menu is opened, let the app know
            $dialog.on('shown.bs.dialog', function(){
                publisher.publishOpening({"componentOpening": MENU_DESIGNATION});
            });

            //Tie the hidden <file> input with the pretty UI one
            context.$('#file-group').on('click', function(){
                $file.click();
            });

            //When a file is selected, check that it is a CSV file and
            //update the UI if there is an error
            $file.on('change', function(){
                var val = $(this).val();

                if(val.match(/\.csv$/)){
                    $submit.attr('disabled', false);
                    $dummyFile.parent().removeClass('has-error');
                }else{
                    $submit.attr('disabled', true);
                    $dummyFile.parent().addClass('has-error');
                    publisher.publishMessage({
                        "messageType": "error",
                        "messageTitle": "CSV Upload",
                        "messageText": "Not a valid file type."
                    });
                }

                $dummyFile.val(val);
            });

            //Handle submit
            $submit.on('click', function(){
                //Get the file from the input
                var file = $file[0].files[0];

                if(file){
                    //Get the file and process it
                    context.sandbox.utils.getAsText(file, function(text){
                       //The query name is the file's name; create a random queryId
                        var queryName = file.name.split('.')[0],
                            queryId = context.sandbox.utils.UUID(),
                            newAjax;

                        //Create a new collection for the data
                        context.sandbox.dataStorage.datasets[queryId] = new Backbone.Collection();
                        context.sandbox.dataStorage.datasets[queryId].dataService = DATASOURCE_NAME;

                        //Create the layer.Since we don't know what the bounds are, make up a no-area box

                        publisher.createLayer({
                            "layerId": queryId,
                            "name": queryName,
                            "selectable": true
                        });

                        /**
                         * Try the upload. Add the AJAX to our array of open AJAX
                         * so that we can abort them on cancel/clear
                         */
                        newAjax = context.sandbox.csv.upload(text, queryId, queryName,
                            function(data){ //Success function; publish the data
                                cleanOpenAJAXs();
                                publishData(data, queryId, queryName);
                            },
                            function(status, jqXHR){ //Error callback; publish the error
                                cleanOpenAJAXs();
                                publisher.publishMessage({
                                    "messageType": "error",
                                    "messageTitle": "CSV Upload",
                                    "messageText": status.statusText
                                });

                                publisher.publishError({"layerId": queryId});
                            }
                        );

                        openAjaxs.push(newAjax);
                        close();
                    });
                }
            });

            context.$('#upload-cancel').on('click', close); //Handle close
        },
        handleMenuOpening: function(args){
            if(args.componentOpening === MENU_DESIGNATION){
                return;
            }else{
                close();
            }
        },
        clear: function() {
            var queryId;
            $dummyFile.val('');
            $submit.attr('disabled', true);

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

    function publishData(data, queryId, queryName){
        data = JSON.parse(data);

        if(data.length === 0){
            publishFinished(queryId, queryName);
            return;
        }

        //Take the data that is returned and put it into the dataStorage module
        context.sandbox.csv.parse(data, queryId);

        publisher.publishData({
            "layerId": queryId,
            "data": data
        });

        publisher.publishMessage({
            "messageType": "info",
            "messageTitle": "CSV Upload",
            "messageText": data.length + " events have been added to " + queryName + "query layer."
        });

        publishFinished(queryId, queryName);
    }

    function publishFinished(queryId, queryName){
        publisher.publishMessage({
            "messageType": "success",
            "messageTitle": "CSV Upload",
            "messageText": queryName + "Query Complete"
        });

        publisher.publishFinished({"queryId": queryId});
    }

    function stopAllAJAX(){
        openAjaxs.forEach(function(ajax){
            ajax.abort();
        });

        openAjaxs = [];
    }

    /**
     * Stop a query's ajax call,
     * This function requires that ajax.queryId was set when the query was created.
     */
    function abortQuery(queryId){
        openAjaxs.forEach(function(ajax, index){
            if(ajax.queryId === queryId){ //This was set in queryData
                ajax.abort();
                openAjaxs.splice(index, 1);
            }
        });
    }

    /**
     * Clean up all finished ajax calls from the activeAJAXs array
     */
    function cleanOpenAJAXs(){
        openAjaxs.forEach(function(ajax, index){
            if(ajax.readyState === 4){ //4 is "complete" status
                openAjaxs.splice(index, 1);
            }
        });
    }

});