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
            var args,
                layerId = params.layerId,
                data = params.data,
                newpts = [],
                layer = params.map.getLayersBy('layerId', layerId)[0];

            if(layer) {
                context.sandbox.utils.each(data, function(key, value) {
                    var newpt = new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.Point(
                            value.geometry.coordinates[0], 
                            value.geometry.coordinates[1]
                        ).transform(params.map.projectionWGS84, params.map.projection)
                    );

                    var iconData = context.sandbox.icons.getIconForFeature(value) || context.sandbox.mapConfiguration.markerIcons.default;
                    newpt.featureId = value.id || '';
                    newpt.attributes.icon = iconData.icon;
                    newpt.attributes.height = iconData.height;
                    newpt.attributes.width = iconData.width;
                    newpt.attributes.dataService = value.dataService || '';
                    newpts[key] = newpt;
                });

                layer.addFeatures(newpts);
                // layer.recluster();
                layer.refresh({force: true, forces: true});
            } else {
                // No layer exists
            }
        }
    };
    return exposed;
});