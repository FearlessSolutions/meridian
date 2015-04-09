define([
    './../map-api-publisher',
    'text!./../libs/draw/leaflet.draw.css',
    './layers',
    './../libs/leaflet-src',
    './../libs/draw/leaflet.draw-src'
], function(publisher, leafDrawCSS, mapLayers) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    // Set Full-Scope Variables
    var drawControl;

    var exposed = {
        /**
         * Initialize Draw.js
         * @param  {object} thisContext Aura's sandboxed 'this'
         */
        init: function(thisContext) {
            context = thisContext;
            //context.sandbox.utils.addCSS(leafDrawCSS, 'rendering-engines-leaflet-draw-component-style');
        },
        setDrawingActions: function(params){
             // Initialise the FeatureGroup to store editable layers
            //var drawnItems = new L.FeatureGroup();
            //map.addLayer(drawnItems);
            
            params.map.on('draw:created', function(e){
                e.layer.addTo(params.drawnItemsLayer);
                publisher.stopDrawing({
                    "minLon": e.layer.getBounds().getWest(),
                    "minLat": e.layer.getBounds().getSouth(),
                    "maxLon": e.layer.getBounds().getEast(),
                    "maxLat": e.layer.getBounds().getNorth()
                });
            });

        },
        /**
         * Activate Drawing
         * @param  {object} params Parameters JSON
         * @param {object} params.map the map object
         * @param {string} params.layerId the layerId
         * @param {integer} params.sides the number of sides on the polygon
         * @param {boolean} params.irregular true if sides can be of differing length
         */
        startDrawing: function(params) {
            
            // TODO: add switch for points and lines, along with the polygon support
            // var polygonSides,
            //     polygonIrregular,
            //     drawLayer = params.map.getLayersBy('layerId', params.layerId)[0];

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
            //     params.map.addControls([drawControl]);
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
            var a = new L.Draw.Rectangle(params.map, context.sandbox.mapConfiguration.shapeStyles.rectangle).enable();
            // params.map.on('draw:drawstop', function(e){
            //     alert('stopped drawing');
            //     console.debug(e);
            //     a.addTo(drawnItemsLayer);
            // });




        }
    };
    return exposed;
});