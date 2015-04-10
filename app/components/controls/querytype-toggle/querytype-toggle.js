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
            // initial button set
            exposed.initialSet();

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $queryTypeBtn.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });
            $queryTypeBtn.on('click mouseup', function(event) {
                event.preventDefault();
                $queryTypeBtn.removeClass('active');
                context.$(this).addClass('active');
                $queryTypeMenu.hide();
                $('#queryToggleButton').children('span').text(context.$(this).children('span').text())
                publisher.setClick();
            });
        },
        initialSet: function() {
            $('#queryToggleButton').children('span').text('1');
            $queryTypeSquare.addClass('active');
        },
        open: function() {
            $queryTypeMenu.show();
        },
        close: function() {
            $queryTypeMenu.hide();
            alert('');
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