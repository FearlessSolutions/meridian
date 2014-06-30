define([], function(){
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        update: function(params) {
            var heatLayer = params.map.getLayersBy('layerId', 'global_heatmap')[0];

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
            var heatLayer = params.map.getLayersBy('layerId', 'global_heatmap')[0];
            heatLayers.forEach(function(heatLayer){
                heatLayer.deleteFeatures();
            });  
        }
    };

    function generateHeatmap(params) {
        var heatLayer = params.map.getLayersBy('layerId', 'global_heatmap')[0],
            newData = [];

        heatLayer.destroyFeatures();

        context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, collection) {
            if(context.sandbox.stateManager.layers[key].visible && collection.models){
                collection.models.forEach(function(model){
                    newData.push(new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.Point(
                            model.attributes.lon, 
                            model.attributes.lat
                        ).transform(
                            params.map.projectionWGS84,
                            params.map.projection
                        )
                    ));
                });
            }                
        });
        
        heatLayer.addFeatures(newData);
    }

    return exposed;
});