define([], function() {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    // Set Full-Scope Variables
    var config,
        rules = [],
        layerOptionsCollection = [],
        enabled = true,
        visualMode,
        CLUSTER_MODE = 'cluster',
        POINT_MODE = 'feature',
        LAYERID_SUFFIX = '_cluster',
        cache;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            config = context.sandbox.mapConfiguration.clustering;
            cache = {};
            visualMode = context.sandbox.mapConfiguration.defaultVisualMode;
//            populateRules();

        },
        enable: function() {
            enabled = true;
            layerOptionsCollection.forEach(function(layerOptions) {
                layerOptions.strategies.forEach(function(strat) {
                    if (strat.clusters) {
                        strat.distance = config.thresholds.clustering.distance;
                        strat.threshold = config.thresholds.clustering.threshold;
                        strat.recluster();
                    }
                });
            });
        },
        disable: function() {
            enabled = false;
            layerOptionsCollection.forEach(function(layerOptions) {
                layerOptions.strategies.forEach(function(strat) {
                    if (strat.clusters) {
                        strat.distance = config.thresholds.noClustering.distance;
                        strat.threshold = config.thresholds.noClustering.threshold;
                        strat.recluster();
                    }
                });
            });
        },
        update: function(params) {
            var visibility = false;
            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(layerId, collections) {
                if(context.sandbox.stateManager.map.visualMode === 'cluster' || context.sandbox.stateManager.map.visualMode === 'feature') {
                    visibility = context.sandbox.stateManager.layers[layerId].visible;
                }
                params.map.getLayersBy('layerId', layerId)[0].setVisibility(visibility);
            });
        },
        /**
         * Add the clustering stylesheets to a layer
         * @param layerOptions
         */
        addClusteringToLayerOptions: function(layerOptions) {
            var style = new ol.Style(ol.Util.applyDefaults({
                externalGraphic: "${icon}",
                graphicOpacity: 1,
                pointRadius: 15,
                graphicHeight: "${height}",
                graphicWidth: "${width}",
                graphicYOffset: context.sandbox.mapConfiguration.markerIcons.default.graphicYOffset || 0
            }, ol.Feature.Vector.style["default"]), {
                rules: rules,
                context: {
                    width: function(feature) {
                        return feature.cluster ? 0 : feature.attributes.width;
                    },
                    height: function(feature) {
                        return feature.cluster ? 0 : feature.attributes.height;
                    },
                    icon: function(feature) {
                        return feature.cluster ? "" : feature.attributes.icon;
                    }
                }
            });

            layerOptions.styleMap = {
               "default": style,
               "select": style
            };

            layerOptions.strategies = [
                new ol.Strategy.Cluster(enabled ?
                    config.thresholds.clustering : config.thresholds.noClustering)
            ];
            layerOptions.rendererOptions = {zIndexing: true};
            layerOptions.recluster = function() {
                this.strategies[0].recluster();
            };

            layerOptionsCollection.push(layerOptions);
        },
        deleteClusteringLayerOptions: function(params) {
            context.sandbox.utils.each(layerOptionsCollection, function(key, value) {
                if(value.layerId === params.layerId) {
                    layerOptionsCollection.splice(key, 1);
                    return false;
                }
            });
        },
        visualModeChanged: function(params) {
            var map = params.map;

            if(params.mode === CLUSTER_MODE) {
                context.sandbox.utils.each(cache, function(layerId, layerCache){
                    map.getLayer(layerId).setVisible(false);
                    map.getLayer(layerId + LAYERID_SUFFIX).setVisible(true);
                });
            } else if(params.mode === POINT_MODE) {
                context.sandbox.utils.each(cache, function(layerId, layerCache){
                    map.getLayer(layerId).setVisible(true);
                    map.getLayer(layerId + LAYERID_SUFFIX).setVisible(false);
                });
            } else {
                context.sandbox.utils.each(cache, function(layerId, layerCache){
                    map.getLayer(layerId).setVisible(false);
                    map.getLayer(layerId + LAYERID_SUFFIX).setVisible(false);
                });
            }
        },
        recluster: function(params) {
            var layer =  params.map.getLayersBy('layerId', params.layerId)[0];
            layer.recluster();
        },
        clear: function() {
            layerOptionsCollection = [];
        },
        setupClusteringForLayer: function(params, geoSource, pointStyle){
            var layerId = params.layerId,
                map = params.map,
                clusterSource,
                newClusterLayer;

            clusterSource = clusterSource = new ol.source.Cluster({
                distance: 40,
                source: geoSource
            });

            cache[layerId] = {
                clusterStyleFunction: clusterStyling,
                pointStyleFunction: pointStyle,
                styleCache: {}
            };

            newClusterLayer = new ol.layer.Vector({
                layerId: layerId + LAYERID_SUFFIX,
                source: clusterSource,
                style: clusterStyling,
                visible: visualMode === CLUSTER_MODE
            });

            map.addLayer(newClusterLayer);

        },
        applyCustomSymbolizers: function(params) {
            var symbolizers = params.symbolizers;

            var styleMap = {},
                rules = [],
                lowRule,
                midRule,
                highRule,
                noClusterRule;

            lowRule = new ol.Rule({
                filter : new ol.Filter.Comparison({
                    type: ol.Filter.Comparison.LESS_THAN,
                    property: "count",
                    value: 10
                }),
                symbolizer: symbolizers.lowSymbolizer
            });

            midRule = new ol.Rule({
                filter : new ol.Filter.Comparison({
                    type: ol.Filter.Comparison.BETWEEN,
                    property: "count",
                    lowerBoundary: 10,
                    upperBoundary: 99
                }),
                symbolizer: symbolizers.midSymbolizer
            });

            highRule = new ol.Rule({
                filter : new ol.Filter.Comparison({
                    type: ol.Filter.Comparison.GREATER_THAN,
                    property: "count",
                    value: 99
                }),
                symbolizer: symbolizers.highSymbolizer
            });

            noClusterRule = new ol.Rule({
                filter : new ol.Filter.Comparison({
                    type: ol.Filter.Comparison.GREATER_THAN,
                    property: "height",
                    value: 0
                }),
                symbolizer: symbolizers.noClusterSymbolizer
            });

            rules.push(lowRule, midRule, highRule, noClusterRule);

            var style = new ol.Style(ol.Util.applyDefaults({
                externalGraphic: "${icon}",
                graphicOpacity: 1,
                pointRadius: 15,
                graphicHeight: "{height}",
                graphicWidth: "{width",
                graphicYOffset: context.sandbox.mapConfiguration.markerIcons.default.graphicYOffset || 0
            }, ol.Feature.Vector.style["default"]), {
                rules: rules,
                context: {
                    width: function(feature) {
                        return feature.cluster ? 0 : feature.attributes.width;
                    },
                    height: function(feature) {
                        return feature.cluster ? 0 : feature.attributes.height;
                    },
                    icon: function(feature) {
                        return feature.cluster ? "" : feature.attributes.icon;
                    }
                }
            });

            styleMap = {
               "default": style,
               "select": style
            };

            return styleMap;
        },
        getClusterStyle: function(params){
            var feature = params.feature,
                resolution= params.resolution,
                cluster = feature.get('features'),
                layerId,
                cacheEntry;

            if(!cluster){ //Isn't a cluster
                return null;
            } else {
                layerId = cluster[0].get('layerId');
                cacheEntry = cache[layerId];

                if(!cacheEntry){ //Isn't a layer with clustering
                    return null;
                } else if (cluster.length === 1) {
                    return cacheEntry.pointStyleFunction(cluster[0], resolution); //Style the single point in the cluster
                } else {
                    return cacheEntry.clusterStyleFunction(feature, resolution, layerId);
                }
            }
        }
    };

    //TODO
    function populateRules() {
        var lowRule,
            midRule,
            highRule,
            noClusterRule;

        lowRule = new ol.Rule({
            filter : new ol.Filter.Comparison({
                type: ol.Filter.Comparison.LESS_THAN,
                property: "count",
                value: 10
            }),
            symbolizer: config.symbolizers.lowSymbolizer
        });

        midRule = new ol.Rule({
            filter : new ol.Filter.Comparison({
                type: ol.Filter.Comparison.BETWEEN,
                property: "count",
                lowerBoundary: 10,
                upperBoundary: 99
            }),
            symbolizer: config.symbolizers.midSymbolizer
        });

        highRule = new ol.Rule({
            filter : new ol.Filter.Comparison({
                type: ol.Filter.Comparison.GREATER_THAN,
                property: "count",
                value: 99
            }),
            symbolizer: config.symbolizers.highSymbolizer
        });

        noClusterRule = new ol.Rule({
            filter : new ol.Filter.Comparison({
                type: ol.Filter.Comparison.GREATER_THAN,
                property: "height",
                value: 0
            }),
            symbolizer: config.symbolizers.noClusterSymbolizer
        });

        rules.push(lowRule, midRule, highRule, noClusterRule);

    }


    function clusterStyling(feature, resolution, layerId){
        var cluster = feature.get('features'),
            size =  cluster.length,
            layerId = cluster[0].get('layerId'),
            style = cache[layerId].styleCache[size];

        if (!style) {
            if(size === 1){
                style = cache[layerId].pointStyleFunction(cluster[0], resolution);
            } else {
                style = [new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 10 + size/2,
                        stroke: new ol.style.Stroke({
                            color: 'rgb(123, 0, 123)',
//                                    color: 'rgb(153, 0, 153, .5)',
                            opacity:.5,
                            width: size/3.0
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgb(153, 0, 153)',
//                                    color: 'rgb(153, 0, 153, .9)'
                            opacity:.5
                        })
                    }),
                    text: new ol.style.Text({
                        text: size.toString(),
                        fill: new ol.style.Fill({
                            color: '#fff'
                        })
                    })
                })];
                cache[layerId].styleCache[size] = style; //This is only done for size > 1 because 1 is handled by point
            }
        }
        return style;
    }

    return exposed;
});
