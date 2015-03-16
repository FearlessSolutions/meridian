define([
    './bookmark-publisher',
    //'bootstrap'
    'slickcore',
    'slickgrid',
    'slickdataview',
    'slickRowSelectionModel',
    'slickpager',
    'moment'
], function (publisher) {

    var context,
        $bookmarkModal,
        $bookmarkModalBody,
        $bookmarkCloseButton,
        grid,
        data,
        dataView, columns, options;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;

            $bookmarkModal = context.$('#bookmark-modal');
            $bookmarkModalBody = context.$('#bookmark-modal .modal-body');
            $bookmarkCloseButton = context.$('#bookmark-modal.modal button.close');

            $bookmarkModal.modal({
                "backdrop": true,
                "keyboard": true,
                "show": false
             }).on('hidden.bs.modal', function() {
                publisher.closeBookmark();
             });

            $bookmarkCloseButton.on('click', function(event) {
                event.preventDefault();
                publisher.closeBookmark();
            });

            var columns = [
                {id: "col1", name: "Name", field: "bname", minWidth: 155 },
                {id: "col2", name: "Max Lat", field: "maxLat" },
                {id: "col3", name: "Min Lat", field: "minLat" },
                {id: "col4", name: "Max Lon", field: "maxLon" },
                {id: "col5", name: "Min Lon", field: "minLon" },
                {id: "col6", name: "test col", field: "testCol", minWidth:85, formatter: buttonSet }

            ];
            var options = {
                enableCellNavigation: true,
                enableColumnReorder: false,
                //forceFitColumns: true,
                fullWidthRows: true
            };

            var data = [];
            for (var i = 0; i < 500; i++) {
                data[i] = {
                    bname: "Bookmarkname " + i,
                    maxLat: "Max Lat " + i,
                    minLat: "Min Lat " + i,
                    maxLon: "Max Lon " + i,
                    minLon: "Min Lon " + i
                };
            }
            grid = new Slick.Grid("#bmgrid", data, columns, options);

            $(window).resize(function(){
                // redraws grid on browser resize
                grid.resizeCanvas();
                gridHeight();
            });
            //$(window).resize();
            gridHeight();
            grid.resizeCanvas();
            gridHeight();



        },
        openBookmark: function() {
            $bookmarkModal.modal('show');
        },
        closeBookmark: function() {
            $bookmarkModal.modal('hide');
        },
        clear: function() {
            $bookmarkModal.modal('hide');
        }
    };

    function gridHeight () {
        $('#bmgrid').height(300).width(650);
        $('.slick-viewport').height(271);
    }
    function buttonSet(row,cell,value,columnDef,dataContext) {
        var button = "<button title='button1' class='bm1' type='button' id='"+ dataContext.id +"' />" +
            "<button title='button2' class='bm2' type='button' />" +
            "<button title='button3' class='bm3' type='button' />";
        //the id is so that you can identify the row when the particular button is clicked
        return button;

    }

    return exposed;

});