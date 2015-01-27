define([
    './../map-api-publisher',
    './../libs/v3.0.0/build/ol-debug'
], function(publisher) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    // Set Full-Scope Variables
    var drawControl,
        DRAW_LAYER_ID = 'static_draw';

    var exposed = {
        /**
         * Initialize Draw.js
         * @param  {object} thisContext Aura's sandboxed 'this'
         */
        init: function(thisContext) {
            context = thisContext;
            drawControl = new ol.interaction.DragBox({
                condition: ol.events.condition.always,
                projection: new ol.proj.Projection('EPSG:4326'),
                style: new ol.style.Style({ //TODO this is just a default style for box
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
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

                drawLayerSource.addFeature(new ol.Feature(polygon.clone()));
                params.map.removeInteraction(drawControl);
                context.$('#map').css('cursor', 'default');
                publisher.stopDrawing(convertPolygonToCoordinates(polygon, params.map.getView().getProjection()));
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
            params.map.getLayer(DRAW_LAYER_ID).getSource().clear();

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