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
    //TODO add server support
    //TODO put actual data in there
    //TODO add context menu
    //TODO add close button
    //TODO select row



    var context,
        grid,
        dataView,
        pager,
        $datagridContainer,
        datagridVisible = false,
        MOUSE_CLICK_LEFT = 1,
        MOUSE_CLICK_RIGHT = 3,
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
            pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));
//            datagridContextMenu.init(context);
            $datagridContainer = context.$('#datagridContainer');
//            $('#datagridContainer .close').on('click', function(){
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

            var data = [
                {
                    id: 'i1',
                    title: 't1',
                    color: 'c1',
                    percent: 'p1',
                    stuff: 's1'
                },
                {
                    id: 'i2',
                    title: 't2',
                    color: 'c2',
                    percent: 'p2',
                    stuff: 's2'
                },
                {
                    id: 'i3',
                    title: 't3',
                    color: 'c3',
                    percent: 'p3',
                    stuff: 's3'
                }
            ];

            grid = new Slick.Grid('#grid', dataView, columns, options);
            grid.setSelectionModel(new Slick.RowSelectionModel());

            dataView.onRowCountChanged.subscribe(function (e, args) {
                grid.updateRowCount();
                grid.render();
            });

            dataView.onRowsChanged.subscribe(function (e, args) {
                grid.invalidateRows(args.rows);
                grid.render();
            });


            dataView.setItems(data);
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
            $datagridContainer.removeClass('hidden');
            $datagridContainer.height(328);
            grid.resizeCanvas();

        },
        close: function() {
            return;
            $datagridContainer.addClass('hidden');
            $datagridContainer.height(0);
            if(myTable) {
                myTable.removeAllData();
            }
            datagridVisible = false;
        },
        clear: function() {
            return;
            if(myTable) { //In both until refactor
                myTable.removeAllData();
            }
            exposed.close();
        },
        reload: function() {
            return;
            if(datagridVisible) {
                exposed.open();
            }
        },
        refresh: function() {
            return;
            if(datagridVisible && myTable) {
//                myTable.updateTable();
            }
        },
        addData: function(params) {
            return;
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

    return exposed;
    
});