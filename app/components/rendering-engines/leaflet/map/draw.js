define([
    './../map-api-publisher',
    './layers',
    './../libs/draw/leaflet.draw-src'
], function(publisher) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context,
        map,
        drawControl;

    var exposed = {
        /**
         * Initialize Draw.js
         * @param  {object} thisContext Aura's sandboxed 'this'
         */
        init: function(thisContext, thisMap) {
            context = thisContext;
            map = thisMap;

            map.on('draw:created', function(e){
                // e.layer.addTo(params.drawnItemsLayer);
                publisher.stopDrawing({
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
         * @param {object} map the map object
         * @param {string} params.layerId the layerId
         * @param {integer} params.sides the number of sides on the polygon
         * @param {boolean} params.irregular true if sides can be of differing length
         */
        startDrawing: function(params) {
            
            // TODO: add switch for points and lines, along with the polygon support
            // var polygonSides,
            //     polygonIrregular,
            //     drawLayer = map.getLayersBy('layerId', params.layerId)[0];

            // if(!drawControl) {
            //     polygonSides = params.sides || 4;
            //     polygonIrregular = params.irregular || true;

            //     drawControl = new OpenLayers.Control.DrawFeature(
            //         drawLayer,
            //         OpenLayers.Handler.RegularPolygon, {
            //             "handlerOptions": {
            //                 "sides": polygonSides,
            //                 "irregular": polygonIrregular
            //             }
            //         }
            //     );

            //     drawControl.id = 'drawControl';
            //     map.addControls([drawControl]);
            // }
            
            // drawControl.activate();

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
            var a = new L.Draw.Rectangle(map, context.sandbox.mapConfiguration.shapeStyles.rectangle).enable();
            // map.on('draw:drawstop', function(e){
            //     alert('stopped drawing');
            //     console.debug(e);
            //     a.addTo(drawnItemsLayer);
            // });




        }
    };
    return exposed;
});