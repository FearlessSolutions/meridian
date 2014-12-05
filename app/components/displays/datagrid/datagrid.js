define([
    './datagrid-publisher',
    './datagrid-context-menu',
    'slickcore',
    'slickgrid'
], function (publisher, datagridContextMenu) {

    var context,
        grid,
        $datagridContainer,
        datagridVisible = false,
        MOUSE_CLICK_LEFT = 1,
        MOUSE_CLICK_RIGHT = 3;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
//            datagridContextMenu.init(context);
            $datagridContainer = context.$('#datagridContainer');
//            $('#datagridContainer .close').on('click', function(){
//                publisher.closeDatagrid();
//            });

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
                enableCellNavigation: true,
                enableColumnReorder: true,
//                defaultColumnWidth: 100,
                fullWidthRows: true,
                autoEdit: false,
                editable:false,
                syncColumnCellResize: true,
                headerRowHeight:25
            };

            var data = [
                {
                    title: 't1',
                    color: 'c1',
                    percent: 'p1',
                    stuff: 's1'
                },
                {
                    title: 't2',
                    color: 'c2',
                    percent: 'p2',
                    stuff: 's2'
                },
                {
                    title: 't3',
                    color: 'c3',
                    percent: 'p3',
                    stuff: 's3'
                }
            ];

            grid = new Slick.Grid('#datagridContainer', data, columns, options);
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