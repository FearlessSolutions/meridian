define([
    './query-toggle-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        $queryToolButton;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $queryToolButton = context.$('#queryToggleButton');

            //Activate bootstrap tooltip. 
            //Specify container to make the tooltip appear in one line. (Buttons are small and long text is stacked.)
            $queryToolButton.tooltip({
                "container": "body",
                "delay": {
                    "show": 500
                }
            });

            $queryToolButton.on('click', function(event) {
                event.preventDefault();
                if($queryToolButton.hasClass('active')) {
                    // this needs to remove class and also stop drawing rectangle/circle/polygon here
                } else {
                    console.log($queryToolButton.children('span').text());
                    publisher.openQueryTool($queryToolButton.children('span').text());
                }
            });
            var timeoutId = 0;
            $queryToolButton.on('mousedown', function(event) {
                if ($queryToolButton.hasClass('active')) {

                } else {
                    timeoutId = setTimeout(publisher.openQueryType, 500);
                    $queryToolButton.blur();
                };
            }).on('mouseup', function(event) {
                clearTimeout(timeoutId);
                //publisher.closeQueryType; publisher does not work here!
                $('.submenu-button-group').hide();

            });
        },
        setActive: function() {
            $queryToolButton.addClass('active');
        },
        removeActive: function() {
            $queryToolButton.removeClass('active');
        },
        clear: function() {
            $queryToolButton.removeClass('active');
        },
        setClick: function() {
            $queryToolButton.removeClass('active');
            $queryToolButton.click();
        }
    };

    return exposed;
});