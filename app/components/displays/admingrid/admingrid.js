define([
    './admingrid-publisher',
    'slickcore',
    'slickgrid',
    'slickdataview',
    'slickRowSelectionModel',
    'slickpager'
], function (publisher) {

    var context,
    grid,
    data,
    dataView, columns, options;
    var exposed = {
        init: function(thisContext) {
                
            context = thisContext;
            gridHeight();
            var columns = [
                {id: "col1", name: "User ID", field: "id"},
                {id: "col2", name: "Data Source", field: "dataSource"},
                {id: "col3", name: "Query Date", field: "queryDate"},
                {id: "col4", name: "Expiration Date", field: "expireDate"},
            ],
            options = {
                enableCellNavigation: true,
                enableColumnReorder: false,
                defaultColumnWidth: 120,
                fullWidthRows: true
            };            
            data = [];           
            
            grid = new Slick.Grid('#admingrid', data, columns, options);

            var newAJAX = context.sandbox.utils.ajax({
                type: "GET",
                url: context.sandbox.utils.getCurrentNodeJSEndpoint() + '/metadata/user',
                xhrFields: {
                    "withCredentials": true
                }
            })
            .done(function(data) {
                var currentDataArray = [];
              
                context.sandbox.utils.each(data, function (queryId, obj) {
                    var tempObject = {};
                    tempObject.id = queryId;
                    tempObject.dataSource = obj.dataSource;
                    tempObject.queryDate = obj.createdOn || '';
                    tempObject.expireDate = obj.expiresOn || '';
                    currentDataArray.push(tempObject);
                });
                
                grid.setData(currentDataArray);
                grid.resizeCanvas();
            });

            $(window).resize(function(){                
                // redraws grid on browser resize
                gridHeight();
                grid.resizeCanvas();
            });
        },
        open: function() {            
            $('#admingridContainer').css('visibility','visible');                    
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

    function getHeaders(){
        
    }

    /**
     * Take in an array of features for a layer, and make grid data objects for them.
     * @param layerId Id of the layer
     * @param features Array of features in the layer
     * @param headers Header/column information to get keys from
     * @returns {Array}
     */
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
