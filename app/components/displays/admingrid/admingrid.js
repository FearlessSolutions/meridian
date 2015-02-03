define([
    './admingrid-publisher',
    'slickcore',
    'slickgrid',
    'slickdataview',
    'slickRowSelectionModel',
    'slickpager',
    'moment'
], function (publisher) {

    var context,
    grid,
    data,
    dataView, columns, options;
    var exposed = {
        init: function(thisContext) {
                
            context = thisContext,
            dataView = new Slick.Data.DataView();
            gridHeight();
            var columns = [
                {id: "col1", name: "User ID", field: "id"},
                {id: "col2", name: "Data Source", field: "dataSource", maxWidth: 120, sortable: true },
                {id: "col3", name: "Query Date", field: "queryDate", maxWidth: 240 },
                {id: "col4", name: "Expiration Date", field: "expireDate", maxWidth: 240 }
            ],
            options = {
                enableCellNavigation: true,
                //defaultColumnWidth: 120,
                enableColumnReorder: true,
                multiColumnSort: false,
                forceFitColumns: true,
                syncColumnCellResize: true,
                fulWlidthRows: true
            };

            //data = [];           
            
            grid = new Slick.Grid('#admingrid', dataView, columns, options);


            $(window).resize(function(){                
                // redraws grid on browser resize
                gridHeight();
                grid.resizeCanvas();
            });
        },
        open: function() {            
            $('#admingridContainer').css('visibility','visible');                    
        },
        something: function(data) {
            var currentDataArray = [];
              
                context.sandbox.utils.each(data, function (queryId, obj) {
                    var now = moment(),
                        sDate = moment.unix(obj.createdOn) || '', 
                        eDate = moment.unix(obj.expireOn) || '';
                        var sVal = sDate.format('MMMM Do YYYY, hh:mm:ss A');
                        var eVal = eDate.format('MMMM Do YYYY, hh:mm:ss A');

                    var tempObject = {};
                    tempObject.id = obj.userId;
                    tempObject.dataSource = obj.dataSource;
                    tempObject.queryDate = sVal;
                    tempObject.expireDate =  eVal;
                    currentDataArray.push(tempObject);
                });
                
                grid.setData(currentDataArray);
                grid.resizeCanvas();
        }
    };

    /**
     * Create grid headers from column information.
     * Outputs in the same order as input
     * Sets each header width to the text length, or a minimum if that is too small.
     * @returns {Array}
     */
    function gridHeight () {
        $('#admingrid').height($(window).height() - ($('.panel-body').height() + 145));
    }

    function compileData(layerId, features, headers){
        
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
