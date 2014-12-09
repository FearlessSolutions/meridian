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
        GRID_CONTAINER_HEIGHT = 328,
        HIDDEN_CSS = 'hiddenFeature',
        HIDDEN_PROPERTY = 'MERIDIAN_HIDDEN',
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
            defaultFormatter: gridFormatter,
            multiSelect: false //TODO remove this for multiselect.
        };

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            selectedRows = [];
            dataView = new Slick.Data.DataView();
            dataView.getItemMetadata = getItemMetadata;

            datagridContextMenu.init(context);
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
             * It is in single select mode for now
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


            grid.onContextMenu.subscribe(function (e) {
                e.preventDefault();
                var cell = grid.getCellFromEvent(e),
                    item = dataView.getItem(cell.row);

                datagridContextMenu.showMenu({
                    item: item,
                    event: e
                });
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
                $datagridContainer.height(GRID_CONTAINER_HEIGHT);

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
            var compiledData = [],
                columnHeaders = getHeaders();

            if(datagridVisible) {
                exposed.open();
            }

            //Set up data
            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(collectionId, collection) {
                var newCompiledData = compileData(collectionId, collection.models, columnHeaders);
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
        /**
         * On hide feature, update specific feature
         * @param params
         */
        hideFeatures: function(params){

        },
        showFeatures: function(params){

        },
        hideLayer: function(params){
            var layerId = params.layerId,
                layerFeatureCollection = context.sandbox.dataStorage.datasets[layerId];

            if(!layerFeatureCollection){
                return;
            }

            dataView.beginUpdate(); //Grouping all the changes together makes it more efficient.
                context.sandbox.utils.each(layerFeatureCollection.models, function(featureIndex, feature){
                    var featureId = feature.attributes.featureId,
                        item = dataView.getItemById(featureId);
                    item[HIDDEN_PROPERTY] = true;
                    dataView.updateItem(featureId, item);
                });
            dataView.endUpdate();
        },
        showLayer: function(params){
            var layerId = params.layerId,
                layerFeatureCollection = context.sandbox.dataStorage.datasets[layerId],
                layerState = context.sandbox.stateManager.layers[layerId];

            if(!layerFeatureCollection || !layerState){
                return;
            }

            dataView.beginUpdate(); //Grouping all the changes together makes it more efficient.
                context.sandbox.utils.each(layerFeatureCollection.models, function(featureIndex, feature){
                    var featureId = feature.attributes.featureId,
                        item = dataView.getItemById(featureId);

                    if(layerState.hiddenFeatures.indexOf(featureId) === -1){ //Not in the hidden feature array
                        item[HIDDEN_PROPERTY] = false;
                    }else{
                        item[HIDDEN_PROPERTY] = true; //The layer isn't hidden, but the feature still is.
                    }

                    dataView.updateItem(featureId, item);
                });
            dataView.endUpdate();
        }
    };

    /**
     * Create grid headers from column information.
     * Outputs in the same order as input
     * @returns {Array}
     */
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

    /**
     * Take in an array of features for a layer, and make grid data objects for them.
     * @param layerId Id of the layer
     * @param features Array of features in the layer
     * @param headers Header/column information to get keys from
     * @returns {Array}
     */
    function compileData(layerId, features, headers){
        var compiledData = [],
            layerState = context.sandbox.stateManager.layers[layerId],
            isLayerVisible,
            layerHiddenFeatures;

        if(!layerState){
            return [];
        }

        isLayerVisible = layerState.visible;
        layerHiddenFeatures = layerState.hiddenFeatures;

        context.sandbox.utils.each(features, function (featureIndex, feature) {
            var tempObject = {},
                featureId = feature.attributes.featureId;

            context.sandbox.utils.each(headers, function (headerIndex, header) {
                var fieldName = header.field;
                if (feature.attributes.hasOwnProperty(fieldName)) {
                    tempObject[fieldName] = feature.attributes[fieldName];
                }
            });

            tempObject.id = featureId; //Each data point needs a unique id
            tempObject.featureId = featureId; //Each data point needs a unique id
            tempObject.layerId = layerId; //Each data point needs a unique id

            if(!isLayerVisible || layerHiddenFeatures.indexOf(featureId) > -1){
                tempObject[HIDDEN_PROPERTY] = true;
            }

            compiledData.push(tempObject);
        });

        return compiledData;
    }

    /**
     * Replacement for the default Formatter.
     * Is called to style each cell.
     * This is needed to allow HTML in cells.
     * @param row Row index (not necessarily on screen index)
     * @param cell Column index
     * @param value Text value
     * @param columnDef Column metadata
     * @param dataContext Full data item
     * @returns {*}
     */
    function gridFormatter(row, cell, value, columnDef, dataContext){
        if(value === null || value === undefined){
            return '';
        }else{
            return value.toString();
        }
    }

    /**
     * Replacement for dataView.getItemMetadata
     * Is run on each cell to decide options
     * Used to make hidden cells not selectable any styled
     * @param row Row index (not necessarily on screen index)
     * @returns {*}
     */
    function getItemMetadata(row){
        var item = dataView.getItem(row);

        if(item[HIDDEN_PROPERTY]) {
            return    {
                selectable: false,
                cssClasses: HIDDEN_CSS
            };
        }else{
            return {}
        }
    }

    return exposed;

});
