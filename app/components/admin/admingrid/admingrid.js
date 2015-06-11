define([
    'slickcore',
    'slickgrid',
    'slickdataview',
    'slickRowSelectionModel',
    'slickpager',
    'moment'
], function () {

    var context,
        mediator,
        grid,
        dataView,
        $panelBody,
        $admingridContainer,
        $admingrid;

    return {
        init: function(thisContext, thisMediator) {
            var columns,
                options;

            context = thisContext;
            $panelBody = $('.panel-body'); // can't use context, height of panel-body is not static
            $admingridContainer = context.$('#admingridContainer');
            $admingrid = context.$('#admingrid');
            mediator = thisMediator;

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
            $admingridContainer.css('visibility','visible');
        },
        hidden: function() {
            $admingridContainer.css('visibility','hidden');
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
        $admingrid.height(context.sandbox.utils.pageHeight() - ($panelBody.height() + 145));
    }

});
