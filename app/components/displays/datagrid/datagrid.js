define([
    './datagrid-publisher',
    './datagrid-context-menu',
    'datatable'
], function (publisher, datagridContextMenu) {

    var context,
        myTable,
        $datagridContainer,
        datagridVisible = false;

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
                    storedColumns,
                    datasets = context.sandbox.dataStorage.datasets;

                $datagridContainer.removeClass('hidden');
                $datagridContainer.height(328);


                storedColumns = context.sandbox.dataStorage.getColumns();
                 _.each(datasets, function(collection) {
                    _.each(collection.models, function(model) {

                        var tempObject = {};
                        $.each(storedColumns, function(k, v){
                            if(model.attributes.hasOwnProperty(k)) {
                                tempObject[v] = model.attributes[k];
                            } else {
                                tempObject[v] = '';
                            }
                        });
                        compiledData.push(tempObject);

                    });
                });

                var columnsArray = [];
                context.sandbox.utils.each(storedColumns, function(k, v) {
                    columnsArray.push(v);
                });

                if(!myTable) {
                    myTable = $datagridContainer.Datatable({
                        "sortable": true,
                        "pagination": true,
                        "data": compiledData,
                        "columns": columnsArray,
                        "searchable": true,
                        "closeable": false,
                        "clickable": true,
                        "afterRowClick": function(event, target) {
                            if(event.which === 1) {
                                publisher.identifyRecord({
                                    "featureId": target['Feature ID'],
                                    "layerId": target['Layer ID']
                                });
                            } else if (event.which === 3) {
                                datagridContextMenu.showMenu({
                                    "featureId": target['Feature ID'],
                                    "layerId": target['Layer ID'],
                                    "event": event
                                });
                            }
                        },
                        "addRowClasses": addCustomClasses
                    });
                } else {
                    myTable.removeAllData();
                    myTable.updateColumns(columnsArray);
                    myTable.addData(compiledData);
                }
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
            if(myTable) { //In both untill refactor
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
                datasets;

            if(datagridVisible && myTable) {
                datasets = context.sandbox.dataStorage.datasets;

                storedColumns = context.sandbox.dataStorage.getColumns();
                 _.each(datasets, function(collection) {
                    _.each(collection.models, function(model) {

                        var tempObject = {};
                        $.each(storedColumns, function(k, v){
                            if(model.attributes.hasOwnProperty(k)) {
                                tempObject[v] = model.attributes[k];
                            } else {
                                tempObject[v] = '';
                            }
                        });
                        compiledData.push(tempObject);

                    });
                });

                // TODO: update datagrid library to include a 'replaceData' method, that will only flush and replace data while not changing page
                myTable.removeAllData();
                myTable.addData(compiledData);
            }
        }
    };

    function addCustomClasses(params) {
        if(
            !context.sandbox.stateManager.getLayerStateById({"layerId": params.record['Layer ID']}).visible ||
            context.sandbox.stateManager.layers[params.record['Layer ID']].hiddenFeatures.indexOf(params.record['Feature ID']) > -1
        ){
            return ["hiddenFeature"];
        } else {
            return [];
        }
    }

    return exposed;
    
});