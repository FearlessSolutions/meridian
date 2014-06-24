define([
    'underscore',
    '../map-openlayers',
    './heatmap-publisher',
    '../libs/Heatmap/Heatmap'
], function (_, olMapRenderer, publisher){
    // Setup context for storing the context of 'this' from the component's main.js 
    var context,
        map;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            map = olMapRenderer.getMap();
        },
        clear: function(){
            var heatLayers = map.getLayersByName('heatmap');

            heatLayers.forEach(function(heatLayer){
                heatLayer.deleteFeatures();
            });            
        },
        update: function(args) {
            if(args && args.mode) {
                context.sandbox.stateManager.map.visualMode = args.mode;
            }

            var heatLayer = map.getLayersByName('heatmap')[0];
            if(!heatLayer){
                heatLayer = createHeatLayer();
            }

            if(context.sandbox.stateManager.map.visualMode === 'heatmap') {
                heatLayer.setVisibility(true);
                buildHeatmap();
            } else {
                heatLayer.setVisibility(false);
                heatLayer.destroyFeatures();
            }
        }
    };

    function reprojectTo(geom) {
        // transform from map projection to display projection (not too useful)
        return geom.transform(map.projection, map.projectionWGS84);
    }

    function reprojectFrom(geom) {
        // transform from display projection to map projection (not too useful)
        return geom.transform(map.projectionWGS84, map.projection);
    }

    function createHeatLayer(){
        var heatLayer = new OpenLayers.Layer.Vector("heatmap", {
            // use the heatmap renderer instead of the default one (SVG, VML or Canvas)
            renderers: ['Heatmap'],
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    pointRadius: 10,
                    weight: "${weight}" // the 'weight' of the point (between 0.0 and 1.0), used by the heatmap renderer
                }, {
                    context: {
                        weight: function(f) {
                            return 0.05;//Math.min(Math.max((f.attributes.duration || 0) / 43200, 0.25), 1.0);
                        }
                    }
                })
            }),
        });
        map.addLayer(heatLayer);
        return heatLayer;
    }

    function buildHeatmap() {
        var heatLayer = map.getLayersByName('heatmap')[0],
            newData = [];

        heatLayer.destroyFeatures();

        context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, collection) {
            if(context.sandbox.stateManager.layers[key].visible && collection.models){
                collection.models.forEach(function(model){
                    newData.push(new OpenLayers.Feature.Vector(
                        reprojectFrom(
                            new OpenLayers.Geometry.Point(model.attributes.lon, model.attributes.lat)
                        )                        
                    ));
                });
            }                
        });
        
        heatLayer.addFeatures(newData);
    }

    return exposed;

});