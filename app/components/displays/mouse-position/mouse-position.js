define([
    'bootstrap'
], function () {
    var context,
        $container,
        $coordinates,
        DECIMAL_PLACES = 6;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
            $container = context.$('.container');
            $coordinates = context.$('#coordinates');
            $coordinates.html(
                (0).toFixed(DECIMAL_PLACES) + 
                ', ' + 
                (0).toFixed(DECIMAL_PLACES)
            );
        },
        updateCoordinates: function(params){
            var lat = 
            $coordinates.html(
                params.lat.toFixed(DECIMAL_PLACES) + 
                ', ' + 
                params.lon.toFixed(DECIMAL_PLACES)
            );
        },
        hide: function(){
            $container.hide();
        },
        show: function(){
            $container.show();
        },
        clear: function(){} //Not Implemented
    };

    return exposed;
});