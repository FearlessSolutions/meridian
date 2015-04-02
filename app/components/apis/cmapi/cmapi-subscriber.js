define([
    './basemap/cmapi-basemap',
    './view/cmapi-view',
    './overlay/cmapi-overlay',
    './feature/cmapi-feature',
    './status/cmapi-status',
    './clear/cmapi-clear'
], function (basemap, view, overlay, feature, status, clear) {
    var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;

            exposed.subscribeOn();
        },
        subscribeOn: function() {
            //view channels
            context.sandbox.on('map.click', view.mapClick);
        },
        subscribeOff: function() {
            //view channels
            context.sandbox.off('map.click', view.mapClick);
        }
    };	

    return exposed;
});