define([
    'slickcore',
    'slickgrid',
    'slickdataview',
    'slickRowSelectionModel',
    'slickpager',
    'moment'
], function () {

    var context,
    grid,
    data,
    dataView, columns, options;
    var exposed = {
        init: function(thisContext) {
                
            context = thisContext,
            dataView = new Slick.Data.DataView();
            var columns = [
                {id: "col1", name: "User ID", field: "id"},
                {id: "col2", name: "Data Source", field: "dataSource", maxWidth: 120, sortable: true },
                {id: "col3", name: "Query Date", field: "queryDate", maxWidth: 240, sortable: true },
                {id: "col4", name: "Expiration Date", field: "expireDate", maxWidth: 240, sortable: true }
            ],
            options = {
                enableCellNavigation: false,
                enableColumnReorder: true,
                multiColumnSort: false,
                forceFitColumns: true,
                syncColumnCellResize: true,
                fullWidthRows: true
            };
            grid = new Slick.Grid('#admingrid', dataView, columns, options);

            $(window).resize(function(){                
                // redraws grid on browser resize
                gridHeight();
                grid.resizeCanvas();
            });
        },
        visible: function() {
            $('#admingridContainer').css('visibility','visible');                    
        },
        hidden: function() {
            $('#admingridContainer').css('visibility','hidden');
        },
        createGridData: function(data) {
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
                gridHeight();
                grid.setData(currentDataArray);
                grid.resizeCanvas();
        }
    };

    function gridHeight () {
        $('#admingrid').height($(window).height() - ($('.panel-body').height() + 145));
    }

    return exposed;

});
