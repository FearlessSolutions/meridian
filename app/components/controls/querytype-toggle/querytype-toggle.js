define([
    './querytype-toggle-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        $queryTypeMenu,
        $queryTypeBtn,
        $queryTypeSquare,
        $queryTypeCircle,
        $queryTypePolygon;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $queryTypeMenu = context.$('.submenu-button-group');
            $queryTypeBtn = context.$('.submenu-button-group .btn');
            $queryTypeSquare = context.$('#queryType_square');
            $queryTypeCircle = context.$('#queryType_circle');
            $queryTypePolygon = context.$('#queryType_polygon');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $queryTypeBtn.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });
            $queryTypeBtn.on('click', function(event) {
                event.preventDefault();
                $queryTypeMenu.hide();
                $('#queryToggleButton').children('span').text(context.$(this).children('span').text())
            });

            $queryTypeSquare.on('click', function(event) {
                publisher.openQueryTool();
            });
            $queryTypeCircle.on('click', function(event) {
                publisher.openQueryTool();
            });
            $queryTypePolygon.on('click', function(event) {
                publisher.openQueryTool();
            });
        },
        display: function() {
            $queryTypeMenu.show();
        },
        setActive: function() {
            //$queryToolButton.addClass('active');
        },
        removeActive: function() {
            //$queryToolButton.removeClass('active');
        },
        clear: function() {
            //$queryToolButton.removeClass('active');
        }
    };

    return exposed;
});