define([
    './datagrid-context-menu',
    'slickcore',
    'slickgrid',
    'slickdataview',
    'slickRowSelectionModel',
    'slickpager'
], function (datagridContextMenu) {
    /**
     * Style Issues:
     * Header text color --> bold black
     * Header background color --> white or similar?
     * Header background gradient --> remove
     * Header smaller?
     * Highlight color
     * Footer button colors
     * Footer auto show sizes
     * Footer remove 'all' option?
     */

    var context,
        mediator,
        grid,
        dataView,
        pager,
        $datagridContainer,
        $searchTextBox,
        $testArea,
        datagridVisible = false,
        GRID_CONTAINER_HEIGHT = 328,
        HIDDEN_CSS = 'hiddenFeature',
        HIDDEN_PROPERTY = 'MERIDIAN_HIDDEN',
        DEFAULT_PAGE_SIZE = 10,
        ENTER_KEY = 13,

        DEFAULT_GRID_OPTIONS = {
            enableCellNavigation: true,
            enableColumnReorder: true,
            autoEdit: false,
            editable:false,
            forceFitColumns: true,
            syncColumnCellResize: true,
            fullWidthRows: true,
            headerRowHeight:20,
            defaultFormatter: gridFormatter,
            multiSelect: false //TODO remove this for multiselect.
        };

    var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;
            dataView = new Slick.Data.DataView();
            dataView.getItemMetadata = getItemMetadata;
            dataView.setFilter(searchFilter);
            dataView.setFilterArgs({
                searchString: ''
            });

            datagridContextMenu.init(context, thisMediator);
            $datagridContainer = context.$('#datagridContainer');
            $testArea = context.$('#test-area');
            $searchTextBox = context.$('#grid-search-text');

            context.$('.close').on('click', function(){
                mediator.closeDatagrid();
            });

            grid = new Slick.Grid('#grid', dataView, [], DEFAULT_GRID_OPTIONS);
            grid.setSelectionModel(new Slick.RowSelectionModel());
            pager = new Slick.Controls.Pager(dataView, grid, $('#pager'));
            dataView.setPagingOptions({pageSize: DEFAULT_PAGE_SIZE});

            dataView.onRowCountChanged.subscribe(function (e, params) {
                grid.updateRowCount();
                grid.render();
            });

            //When rows change (new data/paging) update grid selected rows
            dataView.onRowsChanged.subscribe(function (e, params) {
                var rows = params.rows,
                    selectedIdsByLayer = context.sandbox.stateManager.getAllIdentifiedFeatures(),
                    newSelectedRows = [];

                grid.invalidateRows(rows);
                grid.render();

                context.sandbox.utils.each(selectedIdsByLayer, function(layerId, selectedFeatures){
                    context.sandbox.utils.each(selectedFeatures, function(index, selectedFeatureId){
                        var rowIndex = dataView.getRowById(selectedFeatureId);
                        if(rowIndex !== undefined){ //If the row is not showing, this will be undefined
                            newSelectedRows.push(rowIndex);
                        }
                    });
                });

                grid.setSelectedRows(newSelectedRows);

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

                    mediator.identifyRecord({
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

            grid.onSort.subscribe(function(e, params){
                var sortcol = params.sortCol.field,
                    comparer;

                comparer = function(a, b){
                    var x = a[sortcol],
                        y = b[sortcol];

                    return (x == y ? 0 : (x > y ? 1 : -1));
                };

                // using native sort with comparer
                // preferred method but can be very slow in IE with huge datasets
                dataView.sort(comparer, params.sortAsc);
            });

            context.$('#grid-search-btn').on('click', function(e){
                var searchString = $searchTextBox.val().toLowerCase();
                Slick.GlobalEditorLock.cancelCurrentEdit(); //Stop any edits taking place

                dataView.setFilterArgs({
                    searchString: searchString
                });
                dataView.refresh();
            });

            //If the user hits 'enter' while entering a search, run the search
            $searchTextBox.on('keydown', function(e){
                var key = e.keyCode;

                if(key === ENTER_KEY){
                    context.$('#grid-search-btn').click();
                }
            });
            $(window).resize(function(){
                // redraws grid on browser resize
                grid.resizeCanvas();
            });
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
                mediator.closeDatagrid();
                datagridVisible = false;
            }

            grid.resizeCanvas();
        },
        close: function() {
            $datagridContainer.addClass('hidden');
            $datagridContainer.height(0);

            datagridVisible = false;
        },
        clear: function() {
            grid.setColumns([]); //Update columns
            dataView.setItems([]); //Update rows
            $searchTextBox.val('');
            dataView.setFilterArgs({
                searchString: ''
            });

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
            var layerId = params.layerId,
                featureIds = params.featureIds;

            if(!layerId || !featureIds){
                return;
            }

            dataView.beginUpdate(); //Grouping all the changes together makes it more efficient.
                context.sandbox.utils.each(featureIds, function(featureIndex, featureId){
                    var item = dataView.getItemById(featureId);
                    if(item){
                        item[HIDDEN_PROPERTY] = true;
                        dataView.updateItem(featureId, item);
                    }
                });
            dataView.endUpdate();
        },
        showFeatures: function(params){
            var layerId = params.layerId,
                featureIds = params.featureIds;

            if(!layerId || !featureIds){
                return;
            }

            dataView.beginUpdate(); //Grouping all the changes together makes it more efficient.
            context.sandbox.utils.each(featureIds, function(featureIndex, featureId){
                var item = dataView.getItemById(featureId);
                if(item){
                    item[HIDDEN_PROPERTY] = false;
                    dataView.updateItem(featureId, item);
                }
            });
            dataView.endUpdate();
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
                    if(item){
                        item[HIDDEN_PROPERTY] = true;
                        dataView.updateItem(featureId, item);
                    }
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

                    item[HIDDEN_PROPERTY] = layerState.hiddenFeatures.indexOf(featureId) !== -1;

                    dataView.updateItem(featureId, item);
                });
            dataView.endUpdate();
        }
    };

    /**
     * Create grid headers from column information.
     * Outputs in the same order as input
     * Sets each header width to the text length, or a minimum if that is too small.
     * @returns {Array}
     */
    function getHeaders(){
        var columnHeadersMetadata = context.sandbox.dataStorage.getColumns(),
            columnHeaders = [];            //Set up headers. They should already be in the correct order.
            
        context.sandbox.utils.each(columnHeadersMetadata, function (columnHeaderIndex, columnHeaderMetadata) {
            var width;

            $testArea.html('<span>' + columnHeaderMetadata.displayName + '</span>'); //This is the only way to find text length. Is styled  the same as header
            width = $testArea.find('span').width() + 30;
            width = width < 150 ? 150 : width;

            columnHeaders.push({
                id: columnHeaderMetadata.property + columnHeaderMetadata.displayName,
                name: columnHeaderMetadata.displayName,
                field: columnHeaderMetadata.property,
                minWidth: width,
                sortable: true
            });
        });

        $testArea.empty();
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
            return {};
        }
    }

    return exposed;


    function searchFilter(item, params){
        var searchString = params.searchString,
            found = false;

        context.sandbox.utils.each(item, function(field, value){
            if (typeof value !== 'undefined' && value !== null && value.toString().toLowerCase().indexOf(searchString) != -1) {
                found = true;
                return false; //this breaks the $.each loop
            }
        });

        return found;
    }
});
