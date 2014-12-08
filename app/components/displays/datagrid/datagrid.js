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
    //TODO add context menu  // http://mleibman.github.io/SlickGrid/examples/example7-events.html
    //TODO add close button
    //TODO make styling more like old one
    //TODO      column widths
    //TODO      coloring? (I like the default)
    //TODO Pager: larger pager
    //TODO Pager: Auto show page size options
    //TODO Pager: ??? 'go to' page option
    //TODO Pager: COULD USE PREVIOUS PAGER
    //TODO Could use previous header
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
        selectedRows,
        DEFAULT_GRID_OPTIONS = {
            enableCellNavigation: true,
            enableColumnReorder: true,
            defaultColumnWidth: 150,
            fullWidthRows: true,
            autoEdit: false,
            editable:false,
            syncColumnCellResize: true,
            headerRowHeight:25,
            defaultFormatter: gridFormatter
        };

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            selectedRows = [];
            dataView = new Slick.Data.DataView();
//            datagridContextMenu.init(context); //TODO
            $datagridContainer = context.$('#datagridContainer');
//            $('#datagridContainer .close').on('click', function(){ //TODO
//                publisher.closeDatagrid();
//            });

            grid = new Slick.Grid('#grid', dataView, [], DEFAULT_GRID_OPTIONS);
            grid.setSelectionModel(new Slick.RowSelectionModel());
            pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));

            dataView.onRowCountChanged.subscribe(function (e, params) {
                grid.updateRowCount();
                grid.render();
            });

            dataView.onRowsChanged.subscribe(function (e, params) {
                grid.invalidateRows(params.rows);
                grid.render();
            });

            //If the user clicks a link, don't select the row. This happens before other onClicks, so stops the rest.
            grid.onClick.subscribe(function(e, params){
                if(e.target.href){ //The target is a link
                    e.stopImmediatePropagation();
                }
            });


            /**
             * Handles both select and deselect.
             * While we are only using single select, enforce
             */
            grid.onSelectedRowsChanged.subscribe(function(e, params) {
                var gridSelectedRowNumbers = params.rows,
                    rowData;

                //Enforce single selection
                if(gridSelectedRowNumbers.length){ //Were some selected, not now
                    rowData = dataView.getItem(gridSelectedRowNumbers[gridSelectedRowNumbers.length -1 ]); //Use the last one

                    publisher.identifyRecord({
                        featureId: rowData.featureId,
                        layerId: rowData.layerId
                    });
                }

            });


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
            if(!context.sandbox.utils.isEmptyObject(context.sandbox.dataStorage.datasets)) {
                $datagridContainer.removeClass('hidden');
                $datagridContainer.height(328);

                datagridVisible = true;
            } else {
                publisher.closeDatagrid();
                datagridVisible = false;
            }

            grid.resizeCanvas();
        },
        close: function() {
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
            if(datagridVisible) {
                exposed.open();
            }

            var compiledData = [],
                columnHeaders = getHeaders();

            //Set up data
            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(collectionIndex, collection) {
                var newCompiledData = compileData(collection.models, columnHeaders);
                compiledData = compiledData.concat(newCompiledData);
            });

            grid.setColumns(columnHeaders); //Update columns
            dataView.setItems(compiledData); //Update rows
        },
        refresh: function() { //TODO Do we need this?
            if(datagridVisible) {
                exposed.reload();
            }
        },
        /**
         * We assume that any new data is already part of the dataset.
         * @param params
         */
        addData: function(params) { //TODO Find way to ignore aoi, then add new data when actual data
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

//    function addCustomClasses(params) {
//        if(
//            !context.sandbox.stateManager.getLayerStateById({layerId: params.record['Layer ID']}).visible ||
//            context.sandbox.stateManager.layers[params.record['Layer ID']].hiddenFeatures.indexOf(params.record['Feature ID']) > -1
//        ){
//            return ['hiddenFeature'];
//        } else {
//            return [];
//        }
//    }

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
            tempObject.featureId = feature.attributes.featureId; //Each data point needs a unique id
            tempObject.layerId = feature.attributes.layerId; //Each data point needs a unique id

            compiledData.push(tempObject);
        });

        return compiledData;
    }

    function gridFormatter(row, cell, value, columnDef, dataContext){
        if(value === null || value === undefined){
            return '';
        }else{
            return value.toString();
        }
    }

    return exposed;

});
