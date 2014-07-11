define([
    './../libs/openlayers-2.13.1/OpenLayers'
], function(){
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        plotFeatures: function(params) {
            var layerId = params.layerId,
                data = params.data,
                newFeatures = [],
                layer = params.map.getLayersBy('layerId', layerId)[0],
                geoJsonParser;

            // TODO: Need to address how geoJSON feature collections are handled
            geoJsonParser = new OpenLayers.Format.GeoJSON({
                "ignoreExtraDims": false,
                "internalProjection": params.map.projection,
                "externalProjection": params.map.projectionWGS84
            });

            if(layer) {
                context.sandbox.utils.each(data, function(key, value) {
                        var currentFeature = geoJsonParser.parseFeature(value),
                        iconData;
                    
                    iconData = context.sandbox.icons.getIconForFeature({"properties": value.properties}) || context.sandbox.mapConfiguration.markerIcons.default;
                    currentFeature.featureId = value.id || '';
                    currentFeature.attributes.icon = iconData.icon;
                    currentFeature.attributes.height = iconData.height;
                    currentFeature.attributes.width = iconData.width;
                    currentFeature.attributes.dataService = value.dataService || '';

                    newFeatures[key] = currentFeature;
                });

                layer.addFeatures(newFeatures);
                if(context.sandbox.stateManager.map.visualMode === 'cluster') {
                    layer.recluster();
                }
                layer.refresh({
                    "force": true,
                    "forces": true
                });
            }
        }
    };
    return exposed;
});