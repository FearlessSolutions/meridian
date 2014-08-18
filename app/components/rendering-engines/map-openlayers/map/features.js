define([
    './base',
    './../libs/openlayers-2.13.1/OpenLayers'
], function(mapBase) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        /**
         * Plot features given in geoJSON format
         * @param params
         */
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
                    
                    var currentFeature = geoJsonParser.parseFeature(value);
                    
                    currentFeature.featureId = value.id || '';
                    currentFeature.attributes.dataService = value.dataService || '';

                    // Handle default styles if none defined
                    if(!currentFeature.attributes.icon) {
                        iconData = context.sandbox.icons.getIconForFeature(value);
                        currentFeature.attributes.icon = iconData.icon;
                        currentFeature.attributes.height = iconData.height;
                        currentFeature.attributes.width = iconData.width;
                    }
                     
                    newFeatures.push(currentFeature);
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
        },
        hideFeatures: function(params) {
            var layerId = params.layerId,
                featureIds = params.featureIds,
                layer = params.map.getLayersBy('layerId', layerId)[0];

            if(layer) {
                context.sandbox.stateManager.addHiddenFeaturesByLayerId({
                    "layerId": layerId,
                    "featureIds": featureIds
                });

                context.sandbox.utils.each(featureIds, function(index, featureId) {
                    var feature = layer.getFeatureBy('featureId', featureId);
                    if(feature) {
                        if(!feature.style) {
                            feature.style = {}; 
                        }
                        feature.style.display = "none";
                    } else {
                        context.sandbox.utils.each(layer.features, function(index, clusterFeature) {
                            if(clusterFeature.cluster) {
                                context.sandbox.utils.each(clusterFeature.cluster, function(index, feature) {
                                    if(feature.featureId === featureId) {
                                        if(!feature.style) {
                                            feature.style = {}; 
                                        }
                                        feature.style.display = "none"; 
                                        return;
                                    }
                                });
                            }
                        });
                    }
                });

                layer.redraw();
                if(context.sandbox.stateManager.map.visualMode === 'cluster') {
                    layer.recluster();
                }
                layer.refresh({
                    "force": true,
                    "forces": true
                });

                var identifiedFeatures = context.sandbox.stateManager.getIdentifiedFeaturesByLayerId({
                    "layerId": layer.layerId
                });

                
                context.sandbox.utils.each(identifiedFeatures, function(i1, identifiedfid){
                    context.sandbox.utils.each(featureIds, function(i2, fid){
                        if(fid === identifiedfid) {
                            mapBase.clearMapSelection({
                                "map": params.map
                            });
                            mapBase.clearMapPopups({
                                "map": params.map
                            });
                            return;
                        }
                    });   
                });
            }
        },
        showFeatures: function(params) {
            var layerId = params.layerId,
                featureIds = params.featureIds,
                layer = params.map.getLayersBy('layerId', layerId)[0];

            if(layer) {
                context.sandbox.stateManager.removeHiddenFeaturesByLayerId({
                    "layerId": layerId,
                    "featureIds": featureIds
                });

                if(context.sandbox.stateManager.map.visualMode === 'cluster') {
                    layer.recluster();
                }

                context.sandbox.utils.each(featureIds, function(index, featureId) {
                    var feature = layer.getFeatureBy('featureId', featureId);
                    if(feature) {
                        feature.style = null; 
                    } else {
                        context.sandbox.utils.each(layer.features, function(index, clusterFeature) {
                            if(clusterFeature.cluster) {
                                context.sandbox.utils.each(clusterFeature.cluster, function(index, feature) {
                                    if(feature.featureId === featureId) {
                                        feature.style = null; 
                                        return;
                                    }
                                });
                            }
                        });
                    }
                });

                layer.redraw();
                layer.refresh({
                    "force": true,
                    "forces": true
                });
            }
        }
    };
    return exposed;
});