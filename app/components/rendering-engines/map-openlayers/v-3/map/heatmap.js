//-add all to layer
//-clear (which might need to be done by changing to a vector source) before update
//-toggle layer as needed


define([], function() {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context,
        map,
        heatLayer,
        CLUSTER_MODE,
        FEATURE_MODE,
        HEAT_MODE,
        AOI_TYPE,
        STATIC_TYPE,
        LAYERID_SUFFIX;

    var exposed = {
        init: function(modules) {
            context = modules.context;

            CLUSTER_MODE = context.sandbox.mapConfiguration.CLUSTER_MODE;
            FEATURE_MODE = context.sandbox.mapConfiguration.FEATURE_MODE;
            HEAT_MODE = context.sandbox.mapConfiguration.HEAT_MODE;
            AOI_TYPE = context.sandbox.mapConfiguration.AOI_TYPE;
            STATIC_TYPE = context.sandbox.mapConfiguration.STATIC_TYPE;
            LAYERID_SUFFIX = context.sandbox.mapConfiguration.LAYERID_SUFFIX;
        },
        setMap: function(params){
            map = params.map;
        },
        enable: function(params){
            //Turn off all of the AOIs
            map.getLayers().forEach(function(layer, layerIndex, layerArray){
                var layerType = layer.get('layerType');
                if (layerType === AOI_TYPE){
                    layer.setVisible(false);
                }
            });

            generateHeatmap(params);
        },
        disable: function(params){
            exposed.clear(params)
        },
        update: function(params) {
            if(context.sandbox.stateManager.map.visualMode === HEAT_MODE) {
                generateHeatmap({});
            } else {
                heatLayer.clear();
            }
        },
        createHeatmap: function(params){
            exposed.clear({
            });
        },
        clear: function(params) {
            if(heatLayer){
                map.removeLayer(heatLayer)
            }

            heatLayer =  new ol.layer.Heatmap({
                layerType: HEAT_MODE,
                source: new ol.source.GeoJSON({
                    features: []
                }),
                radius: 5
            });
            map.addLayer(heatLayer);
        }
    };

    /**
     * Generate heatmap based on sandbox.dataStorage layer visibility
     * Ignores polygons
     * @param params
     * //TODO polygons
     */
    function generateHeatmap(params) {
        var heatFeatures = [];

        exposed.clear({});

        context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(key, collection) {
            var layer,
                layerSource,
                features;

            if(context.sandbox.stateManager.layers[key] && context.sandbox.stateManager.layers[key].visible && collection.models) {
                layer = map.getLayer(key);
                if(layer){
                    //Get the source of the layer. It might have two layers of sources, so dig down.
                    layerSource = layer.getSource();
                    while(layerSource.source_){
                        layerSource = layerSource.source_;
                    }

                    features = layerSource.getFeatures();
                    context.sandbox.utils.each(features, function(featureIndex, feature){
                        if(feature.getGeometry().getType() === 'Point'){
                            heatFeatures.push(feature.clone()); //Only heatmap point
                        }
                    });
                }
            }
        });
        
        heatLayer.addFeatures(heatFeatures);
    }

    return exposed;
});