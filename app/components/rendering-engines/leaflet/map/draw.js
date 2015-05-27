define([
    './../map-api-publisher',
    './../libs/draw/leaflet.draw-src'
], function(publisher) {
    var context,
        map,
        drawControl;

    var exposed = {
        /**
         * Initialize Draw.js
         * @param  {object} thisContext Aura's sandboxed 'this'
         * @param {object} Reference to the Map object.
         */
        init: function(thisContext, thisMap) {
            context = thisContext;
            map = thisMap;

            map.on('draw:created', function(e){
                var uniqueId = context.sandbox.utils.UUID();
                // e.layer.addTo(params.drawnItemsLayer);
                publisher.stopDrawing({
                    shapeId: uniqueId + '_aoi',
                    minLon: e.layer.getBounds().getWest(),
                    minLat: e.layer.getBounds().getSouth(),
                    maxLon: e.layer.getBounds().getEast(),
                    maxLat: e.layer.getBounds().getNorth()
                });
            });
        },
        /**
         * Activate Drawing
         * @param  {object} params Parameters JSON
         */
        enableDrawing: function(params) {
            // var options = {
            //         rectangle:{
            //             shapeOptions:{
            //                 color: '#000000',
            //                 fillColor: '#8b8a8a',
            //                 clickable: false,
            //                 weight: 1
            //             }
            //         }
            // };
            drawControl = new L.Draw.Rectangle(map, context.sandbox.mapConfiguration.shapeStyles.rectangle);
            drawControl.enable();
        },
        /**
         * Deactivate Drawing
         * @param  {object} params Parameters JSON
         */
        disableDrawing: function(params) {
            if(drawControl){
                drawControl.disable();
            }
        }
    };
    return exposed;
});