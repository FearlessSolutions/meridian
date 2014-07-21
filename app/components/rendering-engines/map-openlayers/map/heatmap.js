define([], function(){
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        update: function(params) {
            var heatLayer = params.map.getLayersBy('layerId', 'static_heatmap')[0];

            if(context.sandbox.stateManager.map.visualMode === 'heatmap') {
                heatLayer.setVisibility(true);
                generateHeatmap({
                    "map": params.map
                });
            } else {
                heatLayer.setVisibility(false);
                heatLayer.destroyFeatures();
            }
        },
        clear: function(params) {
            var heatLayer = params.map.getLayersBy('layerId', 'static_heatmap')[0];
            if(heatLayer) {
                heatLayer.deleteFeatures();
            }
        }
    };

    function generateHeatmap(params) {
        var heatLayer = params.map.getLayersBy('layerId', 'static_heatmap')[0],
            newData = [],
            geoJsonParser;

        geoJsonParser = new OpenLayers.Format.GeoJSON({
            "ignoreExtraDims": false,
            "internalProjection": params.map.projection,
            "externalProjection": params.map.projectionWGS84
        });

        heatLayer.destroyFeatures();

        context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, collection) {
            if(context.sandbox.stateManager.layers[key] && context.sandbox.stateManager.layers[key].visible && collection.models) {
                collection.models.forEach(function(model){
                    var geometry = model.attributes.geometry;
                    if(geometry.type === "Point"){
                        newData.push(new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.Point(
                                geometry.coordinates[0],
                                geometry.coordinates[1]
                            ).transform(
                                params.map.projectionWGS84,
                                params.map.projection
                            )
                        ));
                    }else{ //TODO The heatmap library only handles points.
                      //  var feature = geoJsonParser.parseFeature(model.attributes);
                      //  newData.push(feature);
                    }
                });
            }                
        });
        
        heatLayer.addFeatures(newData);
    }

    return exposed;
});