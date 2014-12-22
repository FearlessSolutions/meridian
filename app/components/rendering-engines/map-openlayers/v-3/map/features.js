define([
    './base',
    './../libs/v3.0.0/build/ol-debug'
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
            geoJsonParser = new ol.Format.GeoJSON({
                "ignoreExtraDims": true, //Sometimes we get points which are 3d. This prevents OL from failing.
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
                layer = params.map.getLayersBy('layerId', layerId)[0],
                currentHiddenFeatures = [];

            if(layer) {
                if(params.exclusive === true) { // Show all previously hidden features before hiding new ones
                    exposed.showAllFeatures({
                        "map": params.map,
                        "layerId": layerId
                    });
                }

                context.sandbox.stateManager.addHiddenFeaturesByLayerId({
                    "layerId": layerId,
                    "featureIds": featureIds
                });

                if(context.sandbox.stateManager.map.visualMode === 'cluster') {
                    layer.recluster();
                }

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
        hideAllFeatures: function(params) {
            var layerId = params.layerId,
                layer = params.map.getLayersBy('layerId', layerId)[0],
                hiddenFeatureIds = [];

            context.sandbox.utils.each(layer.features, function(index, feature) {
                if(feature.cluster) {
                    context.sandbox.utils.each(feature.cluster, function(index, record) {
                        hiddenFeatureIds.push(record.featureId);
                        if(!record.style) {
                            record.style = {}; 
                        }
                        record.style.display = "none";
                    });
                } else {
                    hiddenFeatureIds.push(feature.featureId);
                    if(!feature.style) {
                        feature.style = {}; 
                    }
                    feature.style.display = "none";
                }
            });

            context.sandbox.stateManager.addHiddenFeaturesByLayerId({
                "layerId": layerId,
                "featureIds": hiddenFeatureIds
            });

            if(context.sandbox.stateManager.map.visualMode === 'cluster') {
                layer.recluster();
            }

            layer.redraw();
            layer.refresh({
                "force": true,
                "forces": true
            });
        },
        showFeatures: function(params) {
            var layerId = params.layerId,
                featureIds = params.featureIds,
                layer = params.map.getLayersBy('layerId', layerId)[0],
                identifiedFeatures;

            if(layer) {
                if(params.exclusive === true) { // Show all previously hidden features before hiding new ones
                    exposed.hideAllFeatures({
                        "map": params.map,
                        "layerId": layerId
                    });

                    // Steps to clear popup IF it doess not belong to one of the features exclussively being shown
                    identifiedFeatures = context.sandbox.stateManager.getIdentifiedFeaturesByLayerId({
                        "layerId": layer.layerId
                    });
                    context.sandbox.utils.each(identifiedFeatures, function(i1, identifiedfid){  // TODO: if this is ever enhanced to allow multiple identifation windows, this will need updating
                        if(featureIds.indexOf(identifiedfid) === -1) {
                            mapBase.clearMapSelection({
                                "map": params.map
                            });
                            mapBase.clearMapPopups({
                                "map": params.map
                            });
                        }  
                    });
                }

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
        },
        showAllFeatures: function(params) {
            var layerId = params.layerId,
                layer = params.map.getLayersBy('layerId', layerId)[0];

            context.sandbox.stateManager.removeAllHiddenFeaturesByLayerId({
                "layerId": layerId
            });

            if(context.sandbox.stateManager.map.visualMode === 'cluster') {
                layer.recluster();
            }

            context.sandbox.utils.each(layer.features, function(index, feature) {
                if(feature.cluster) {
                    context.sandbox.utils.each(feature.cluster, function(index, record) {
                        record.style = null;
                    });
                } else {
                    feature.style = null;
                }
            });

            layer.redraw();
            layer.refresh({
                "force": true,
                "forces": true
            });
        },
        updateFeatures: function(params) {  // TODO: finish method to support full feature updating (attributes, styles, etc.)
            var layerId = params.layerId,
                featureObjects = params.featureObjects,
                layer = params.map.getLayersBy('layerId', layerId)[0];

            if(layer) {
                context.sandbox.utils.each(featureObjects, function(key, featureObject) {
                    var feature = layer.getFeatureBy('featureId', featureObject.featureId);

                    // If no feature found, look for feature in clusters
                    if(!feature) {
                        context.sandbox.utils.each(layer.features, function(k1, v1){
                            if(v1.cluster) {
                                context.sandbox.utils.each(v1.cluster, function(k2, v2){
                                    if(featureObject.featureId === v2.featureId) {
                                        feature = v2;
                                    }
                                });
                            }
                        });
                    }

                    if(feature) { 
                        context.sandbox.utils.each(featureObject.style, function(styleKey, styleProperty) { // TODO: Finish to support real style updates 
                            feature.attributes[styleKey] = styleProperty; // Only works when updating attributes that are being consumed by the preexisting stylemap/template
                        });
                    }
                });
            }

            layer.redraw();
            layer.refresh({
                "force": true,
                "forces": true
            });
        }
    };
    return exposed;
});