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
            data = [];
            gridHeight();
            var columns = [
                {id: "userId", name: "User ID", field: "userId"},
                {id: "dataSource", name: "Data Source", field: "dataSource"},
                {id: "start", name: "Query Date", field: "start"},
                {id: "finish", name: "Expiration Date", field: "finish"},
            ],
            options = {
                enableCellNavigation: true,
                enableColumnReorder: false,
                defaultColumnWidth: 120,
                fullWidthRows: true
            };

            for (var i = 0; i < 249; i++) {
                  data[i] = {
                    userId: "User ID " + i,
                    dataSource: "mockDB" + i,                    
                    start: "01/01/2009",
                    finish: "01/05/2009"                    
                  };
            }

            grid = new Slick.Grid('#admingrid', data, columns, options);
            // redraws grid on browser resize
            $(window).resize(function(){                
                gridHeight();
                grid.resizeCanvas();
            });
            

        },
        destroy: function() {
            $('#admingridContainer').remove();
        },        
        open: function() {
            //renderGrid();
            //$('#admingridContainer').show();            
        },
        resize: function() {
            


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
