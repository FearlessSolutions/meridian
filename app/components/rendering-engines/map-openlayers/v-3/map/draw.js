define([
    './../libs/v3.0.0/build/ol-debug'
], function() {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context,
        publisher;

    // Set Full-Scope Variables
    var drawControl,
        DRAW_LAYER_ID = 'static_draw';

    var exposed = {
        /**
         * Initialize Draw.js
         * @param  {object} thisContext Aura's sandboxed 'this'
         */
        init: function(modules) {
            context = modules.context;
            publisher = modules.publisher;
            drawControl = new ol.interaction.DragBox({
                condition: ol.events.condition.always,
                style: new ol.style.Style({ //TODO this is just a default style for box
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'purple',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: 'pink'
                        })
                    })
                })
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

            //This must be set here to use the same map object.
            drawControl.onBoxEnd = function(){
                var drawLayerSource = params.map.getLayer(DRAW_LAYER_ID).getSource(),
                    polygon = this.getGeometry();

                console.debug("draw", new ol.Feature(polygon.clone()));

                drawLayerSource.addFeature(new ol.Feature(polygon.clone())); //Has to be cloned
                params.map.removeInteraction(drawControl);
                context.$('#map').css('cursor', 'default');
                publisher.stopDrawing(convertPolygonToCoordinates(polygon, params.map.getProjection()));
            };

            params.map.addInteraction(drawControl);
            context.$('#map').css('cursor', 'crosshair');
        },
        /**
         * Deactivate Drawing
         * @param  {object} params Parameters JSON
         * @param {object} params.map the map object
         * @param {string} params.layerId the layerId
         */
        clearDrawing: function(params) {
//            removeControl(); //TODO need this?
            params.map.getLayer(DRAW_LAYER_ID).clear();

        }
    };

    function convertPolygonToCoordinates(polygon, projection){
        var extent;

        polygon.transform(projection, 'EPSG:4326'); //Does it in place
        extent = polygon.getExtent();
        return {
            minLat: extent[1],
            minLon: extent[0],
            maxLat: extent[3],
            maxLon: extent[2]
        };
    }

    return exposed;
});