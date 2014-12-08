define([
    './datagrid-publisher',
    './datagrid-context-menu',
    'slickcore',
    'slickgrid',
    'slickdataview',
    'slickRowSelectionModel',
    'slickpager'
], function (publisher, datagridContextMenu) {
    //TODO add sort
    //TODO add server support  // libs/SlickGrid-master/slick.remotemodel.js
    //TODO put actual data in there
    //TODO add context menu  // http://mleibman.github.io/SlickGrid/examples/example7-events.html
    //TODO add close button
    //TODO select row triggers
    //TODO make styling more like old one
    //TODO      column widths
    //TODO      coloring? (I like the default)
    //TODO Pager: larger pager
    //TODO Pager: Auto show page size options
    //TODO Pager: ??? 'go to' page option
    //TODO Pager: COULD USE PREVIOUS PAGER
    //TODO Could use previous header
    //TODO make sure featureId is not a default field
    //TODO mark hide
    //TODO add search
    //TODO Pager was changed: decide what to do about it (move it, rename it, use defaults...)


    var context,
        grid,
        dataView,
        pager,
        $datagridContainer,
        datagridVisible = false,
        MOUSE_CLICK_LEFT = 1,
        MOUSE_CLICK_RIGHT = 3,
        GRID_CONTAINER_HEIGHT = 328,
        DEFAULT_GRID_OPTIONS = {
            enableCellNavigation: true,
            enableColumnReorder: true,
//                defaultColumnWidth: 100,
            fullWidthRows: true,
            autoEdit: false,
            editable:false,
            syncColumnCellResize: true,
            headerRowHeight:25
        };

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            dataView = new Slick.Data.DataView();
//            datagridContextMenu.init(context); //TODO
            $datagridContainer = context.$('#datagridContainer');
//            $('#datagridContainer .close').on('click', function(){ //TODO
//                publisher.closeDatagrid();
//            });


            var columns = [
                {
                    id: 'title',
                    name: 'Title',
                    field: 'title'
                },
                {
                    id: '%',
                    name: '% Complete',
                    field: 'percent'
                },
                {
                    id: 'color',
                    name: 'Color',
                    field: 'color'
                }
            ];

            var options = {
//                enableCellNavigation: true,
                enableColumnReorder: true,
//                defaultColumnWidth: 100,
                fullWidthRows: true,
//                autoEdit: false,
//                editable:false,
                syncColumnCellResize: true,
                headerRowHeight:25
            };

//            var data = [
//                {
//                    id: 'i1',
//                    title: 't1',
//                    color: 'c1',
//                    percent: 'p1',
//                    stuff: 's1'
//                },
//                {
//                    id: 'i2',
//                    title: 't2',
//                    color: 'c2',
//                    percent: 'p2',
//                    stuff: 's2'
//                },
//                {
//                    id: 'i3',
//                    title: 't3',
//                    color: 'c3',
//                    percent: 'p3',
//                    stuff: 's3'
//                }
//            ];

            grid = new Slick.Grid('#grid', dataView, [], options);
            grid.setSelectionModel(new Slick.RowSelectionModel());
            pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));

            dataView.onRowCountChanged.subscribe(function (e, args) {
                grid.updateRowCount();
                grid.render();
            });

            dataView.onRowsChanged.subscribe(function (e, args) {
                grid.invalidateRows(args.rows);
                grid.render();
            });

//            dataView.setItems(data);
            exposed.open();
        },
        toggleGrid: function() {
            if($datagridContainer.hasClass('hidden')) {
                exposed.open();
            }else {
                exposed.close();
            }
        },
        /**
         * Set up the data, columns, and then open the datagrid
         */
        open: function() {
            console.debug('open');
            if(!context.sandbox.utils.isEmptyObject(context.sandbox.dataStorage.datasets)) {
                var compiledData = [],
                    tempObject,
                    columnHeadersMetadata = context.sandbox.dataStorage.getColumns(),
                    columnHeaders = [];

                $datagridContainer.removeClass('hidden');
                $datagridContainer.height(328);

//                if(!myTable) {
//                    myTable = $datagridContainer.Datatable({
//                        sortable: true,
//                        pagination: true,
//                        data: compiledData,
//                        columns: columnHeaders,
//                        searchable: true,
//                        closeable: false,
//                        clickable: true,
//                        afterRowClick: function(event, target) {
//
//                            //If it was a link, as set below, do not identify the point.
//                            if(event.originalEvent.isLink){
//                                event.stopPropagation(); //Stop doing other stuff if it is a point
//                            }else if(event.which === MOUSE_CLICK_LEFT) {
//                                publisher.identifyRecord({
//                                    featureId: target['Feature ID'],
//                                    layerId: target['Layer ID']
//                                });
//                            } else if (event.which === MOUSE_CLICK_RIGHT) {
//                                datagridContextMenu.showMenu({
//                                    featureId: target['Feature ID'],
//                                    layerId: target['Layer ID'],
//                                    event: event
//                                });
//                            }
//                        },
//                        addRowClasses: addCustomClasses
//                    });
//                } else {
//                    myTable.removeAllData();
//                    myTable.updateColumns(columnHeaders);
//                    myTable.addData(compiledData);
//                }

//                //If a link was clicked, mark the event as such. This happens before 'afterRowClick' //TODO see if this is a problem
//                context.$('.rowDiv a').on('click', function(e){
//                    e.originalEvent.isLink = true; //The originalEvent is used at all levels during bubbling.
//                });

                datagridVisible = true;
            } else {
                publisher.closeDatagrid();
                datagridVisible = false;
            }


            grid.resizeCanvas();
        },
        close: function() { //TODO
            $datagridContainer.addClass('hidden');
            $datagridContainer.height(0);
//            if(myTable) { //TODO remove data on hide //TODO do we actually want to do this?
//                myTable.removeAllData();
//            }
            datagridVisible = false;
        },
        clear: function() {
            grid.setItems([]);
            grid.setColumns([]);

            exposed.close();
        },
        reload: function() {
            console.debug('reload');
            if(datagridVisible) { //TODO Do we need this?
                exposed.open();
            }

            var compiledData = [],
                columnHeaders = getHeaders();


            //TODO this should only be done on new data.
            //Set up data
            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(collectionIndex, collection) {
                var newCompiledData = compileData(collection.models, columnHeaders);
                compiledData = compiledData.concat(newCompiledData);
            });

            grid.setColumns(columnHeaders); //Update columns
            dataView.setItems(compiledData); //Update rows
        },
        refresh: function() { //TODO Do we need this?
            return;
//            if(datagridVisible && myTable) {
////                myTable.updateTable();
//            }
        },
        /**
         * We assume that any new data is already part of the dataset.
         * @param params
         */
        addData: function(params) { //TODO Find way to ignore aoi, then add new data when actual data
            console.debug('adding data');
            exposed.reload();
        },
        hideFeatures: function(params){

        },
        showFeatures: function(params){

        },
        hideLayer: function(params){

        },
        showLayer: function(params){

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

    function getHeaders(){
        var columnHeadersMetadata = context.sandbox.dataStorage.getColumns(),
            columnHeaders = [];            //Set up headers. They should already be in the correct order.

        context.sandbox.utils.each(columnHeadersMetadata, function (columnHeaderIndex, columnHeaderMetadata) {
            columnHeaders.push({
                id: columnHeaderMetadata.property + columnHeaderMetadata.displayName,
                name: columnHeaderMetadata.displayName,
                field: columnHeaderMetadata.property
            });
        });

        return columnHeaders;
    }

    function compileData(features, headers){
        var compiledData = [];
        context.sandbox.utils.each(features, function (featureIndex, feature) {
            var tempObject = {};

            context.sandbox.utils.each(headers, function (headerIndex, header) {
                var fieldName = header.field;
                if (feature.attributes.hasOwnProperty(fieldName)) {
                    tempObject[fieldName] = feature.attributes[fieldName];
                }
            });

            tempObject.id = feature.attributes.featureId; //Each data point needs a unique id

            compiledData.push(tempObject);
        });

        return compiledData;
    }

    return exposed;

});
