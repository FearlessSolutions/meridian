define([
    './datagrid-publisher',
    './datagrid-context-menu',
    'datatable'
], function (publisher, datagridContextMenu) {

    var context,
        myTable,
        $datagridContainer,
        datagridVisible = false,
        MOUSE_CLICK_LEFT = 1,
        MOUSE_CLICK_RIGHT = 3;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            datagridContextMenu.init(context);
            $datagridContainer = context.$('#datagridContainer');
            $('#datagridContainer .close').on('click', function(){
                publisher.closeDatagrid();
            });
        },
        toggleGrid: function() {
            if($datagridContainer.hasClass('hidden')) {
                exposed.open();
            }else {
                exposed.close();
            }
        },
        open: function() {
            if(!context.sandbox.utils.isEmptyObject(context.sandbox.dataStorage.datasets)) {
                var compiledData = [],
                    tempObject,
                    columnHeadersMetadata = context.sandbox.dataStorage.getColumns(),
                    columnHeaders = context.sandbox.dataStorage.getColumnsDisplayNameArray();

                $datagridContainer.removeClass('hidden');
                $datagridContainer.height(328);

                context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(collectionIndex, collection) {
                    context.sandbox.utils.each(collection.models, function(modelIndex, model) {

                        tempObject = {};
                        context.sandbox.utils.each(columnHeadersMetadata, function(displayMetadataIndex, displayMetadata){
                            if(model.attributes.hasOwnProperty(displayMetadata.property)) {
                                tempObject[displayMetadata.displayName] = model.attributes[displayMetadata.property];
                            } else {
                                tempObject[displayMetadata.displayName] = '';
                            }
                        });

                        compiledData.push(tempObject);
                    });
                });

                if(!myTable) {
                    myTable = $datagridContainer.Datatable({
                        sortable: true,
                        pagination: true,
                        data: compiledData,
                        columns: columnHeaders,
                        searchable: true,
                        closeable: false,
                        clickable: true,
                        afterRowClick: function(event, target) {

                            //If it was a link, as set below, do not identify the point.
                            if(event.originalEvent.isLink){
                                event.stopPropagation(); //Stop doing other stuff if it is a point
                            }else if(event.which === MOUSE_CLICK_LEFT) { 
                                publisher.identifyRecord({
                                    featureId: target['Feature ID'],
                                    layerId: target['Layer ID']
                                });
                            } else if (event.which === MOUSE_CLICK_RIGHT) {
                                datagridContextMenu.showMenu({
                                    featureId: target['Feature ID'],
                                    layerId: target['Layer ID'],
                                    event: event
                                });
                            }
                        },
                        addRowClasses: addCustomClasses
                    });
                } else {
                    myTable.removeAllData();
                    myTable.updateColumns(columnHeaders);
                    myTable.addData(compiledData);
                }

                //If a link was clicked, mark the event as such. This happens before 'afterRowClick'
                context.$('.rowDiv a').on('click', function(e){
                    e.originalEvent.isLink = true; //The originalEvent is used at all levels during bubbling.
                });

                datagridVisible = true;
            } else {
                publisher.closeDatagrid();
                datagridVisible = false;
            }
        },
        close: function() {
            $datagridContainer.addClass('hidden');
            $datagridContainer.height(0);
            if(myTable) {
                myTable.removeAllData();
            }
            datagridVisible = false;
        },
        clear: function() {
            if(myTable) { //In both until refactor
                myTable.removeAllData();
            }
            exposed.close();
        },
        reload: function() {
            if(datagridVisible) {
                exposed.open();
            }
        },
        refresh: function() {
            if(datagridVisible && myTable) {
                myTable.updateTable();
            }
        },
        addData: function(params) {
            var compiledData = [],
                columnHeadersMetadata = context.sandbox.dataStorage.getColumns(),
                columnHeaders = context.sandbox.dataStorage.getColumnsDisplayNameArray(),
                tempObject,
                currentPagination = $('ul.pagination li.active a').html();

            if(datagridVisible && myTable) {
                 context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(collectionIndex, collection) {
                    context.sandbox.utils.each(collection.models, function(modelIndex, model) {
                        tempObject = {};
                        context.sandbox.utils.each(columnHeadersMetadata, function(displayMetadataIndex, displayMetadata){
                            if(model.attributes.hasOwnProperty(displayMetadata.property)) {
                                tempObject[displayMetadata.displayName] = model.attributes[displayMetadata.property];
                            } else {
                                tempObject[displayMetadata.displayName] = '';
                            }
                        });

                        compiledData.push(tempObject);
                    });
                });

                // Remove old data
                myTable.removeAllData();
                myTable.updateColumns(columnHeaders);
                // replace data with new Full Data
                myTable.addData(compiledData);
                // Make sure the table stays on same page as prior to adding data
                myTable.updatePaginator(currentPagination);
            }
        }
    };

    function addCustomClasses(params) {
        if(
            !context.sandbox.stateManager.getLayerStateById({layerId: params.record['Layer ID']}).visible ||
            context.sandbox.stateManager.layers[params.record['Layer ID']].hiddenFeatures.indexOf(params.record['Feature ID']) > -1
        ){
            return ['hiddenFeature'];
        } else {
            return [];
        }
    }

    return exposed;
    
});