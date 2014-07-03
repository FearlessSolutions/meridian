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
                newFeatures = [],
                currentFeature,
                layer = params.map.getLayersBy('layerId', layerId)[0];

            if(layer) {
                context.sandbox.utils.each(data, function(key, value) { // TODO: hoist and cleanup variables
                    
                    // TODO: Test using GeoJSON Parser
                    // var geoJsonParser = new OpenLayers.Format.GeoJSON({
                    //         ignoreExtraDims: false,
                    //         internalProjection: params.map.projection,
                    //         externalProjection: params.map.projectionWGS84
                    //     }),
                    //     currentFeature = geoJsonParser.parseFeature(value),
                    //     iconData;
            

                    // TODO: Test without using GoeJSON Parser
                    if(value.geometry.type.toLowerCase() === 'point'){
                        currentFeature = exposed.createPoint({
                            "map": params.map,
                            "geometry": value.geometry
                        });
                    }
                    
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
                    layer.recluster(); // TODO: Uncomment when clustering is in place
                }
                layer.refresh({force: true, forces: true});
            } else {
                // No layer exists, should we make a temp layer for them?
            }
        },
        createPoint: function(params) {
            var newPoint = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(
                    params.geometry.coordinates[0], 
                    params.geometry.coordinates[1]
                ).transform(params.map.projectionWGS84, params.map.projection)
            );

            return newPoint;
        },
        createLine: function() {

        },
        createPolygon: function() {

        },
        removeFeatures: function(params) {

        }
    };
    return exposed;
});