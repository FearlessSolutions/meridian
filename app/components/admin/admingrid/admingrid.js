define([
    './admingrid-publisher',
    'slickcore',
    'slickgrid',
    'slickdataview',
    'slickRowSelectionModel',
    'slickpager',
    'moment'
], function () {

    var context,
        grid,
        dataView;

    return {
        init: function(thisContext) {
            var columns,
                options;

            context = thisContext;
            dataView = new Slick.Data.DataView();
            columns = [
                {
                    id: 'col1',
                    name: 'User ID',
                    field: 'id'
                },
                {
                    id: 'col2',
                    name: 'Data Source',
                    field: 'dataSource',
                    maxWidth: 120,
                    sortable: true
                },
                {
                    id: 'col3',
                    name: 'Query Date',
                    field: 'queryDate',
                    maxWidth: 240,
                    sortable: true
                },
                {
                    id: 'col4',
                    name: 'Expiration Date',
                    field: 'expireDate',
                    maxWidth: 240,
                    sortable: true
                }
            ];
            options = {
                enableCellNavigation: false,
                enableColumnReorder: true,
                multiColumnSort: false,
                forceFitColumns: true,
                syncColumnCellResize: true,
                fullWidthRows: true
            };

            grid = new Slick.Grid('#admingrid', dataView, columns, options);

            // redraws grid on browser resize
            context.sandbox.utils.onWindowResize(function(){
                gridHeight();
                grid.resizeCanvas();
            });
        },
        visible: function() {
            context.$('#admingridContainer').css('visibility','visible');
        },
        hidden: function() {
            context.$('#admingridContainer').css('visibility','hidden');
        },
        createGridData: function(data) {
            var currentDataArray = [];
              
                context.sandbox.utils.each(data, function (queryId, obj) {
                    var sDate = moment.unix(obj.createdOn) || '',
                        eDate = moment.unix(obj.expireOn) || '',
                        sVal = sDate.format('MMMM Do YYYY, hh:mm:ss A'),
                        eVal = eDate.format('MMMM Do YYYY, hh:mm:ss A');

                    currentDataArray.push({
                        id: obj.userId,
                        dataSource: obj.dataSource,
                        queryDate: sVal,
                        expireDate:  eVal
                    });
                });
                gridHeight();
                grid.setData(currentDataArray);
                grid.resizeCanvas();
        }
    };

    function gridHeight () {
        context.$('#admingrid').height(context.sandbox.utils.pageHeight() - (context.$('.panel-body').height() + 145));
    }

});
