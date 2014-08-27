define([], function() {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    // Set Full-Scope Variables
    var config,
        rules = [],
        layerOptionsCollection = [],
        enabled = true;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            config = context.sandbox.mapConfiguration.clustering;
            populateRules();
            overrideDefaultClustering();
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
            var style = new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                externalGraphic: "${icon}",
                graphicOpacity: 1,
                pointRadius: 15,
                graphicHeight: "${height}",
                graphicWidth: "${width}",
                graphicYOffset: context.sandbox.mapConfiguration.markerIcons.default.graphicYOffset || 0
            }, OpenLayers.Feature.Vector.style["default"]), {
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
                new OpenLayers.Strategy.Cluster(enabled ?
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
            if(params.mode === 'cluster') {
                exposed.enable();
            } else if(params.mode === 'feature') {
                exposed.disable();
            } else {
                return; // likely the value is heatmap, or something else not handled here
            }
        },
        recluster: function(params) {
            var layer =  params.map.getLayersBy('layerId', params.layerId)[0];
            layer.recluster();
        },
        clear: function() {
            layerOptionsCollection = [];
        },
        applyCustomSymbolizers: function(params) {
            var symbolizers = params.symbolizers;

            var styleMap = {},
                rules = [],
                lowRule,
                midRule,
                highRule,
                noClusterRule;

            lowRule = new OpenLayers.Rule({
                filter : new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN,
                    property: "count",
                    value: 10
                }),
                symbolizer: symbolizers.lowSymbolizer
            });

            midRule = new OpenLayers.Rule({
                filter : new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: "count",
                    lowerBoundary: 10,
                    upperBoundary: 99
                }),
                symbolizer: symbolizers.midSymbolizer
            });

            highRule = new OpenLayers.Rule({
                filter : new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN,
                    property: "count",
                    value: 99
                }),
                symbolizer: symbolizers.highSymbolizer
            });

            noClusterRule = new OpenLayers.Rule({
                filter : new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN,
                    property: "height",
                    value: 0
                }),
                symbolizer: symbolizers.noClusterSymbolizer
            });

            rules.push(lowRule, midRule, highRule, noClusterRule);

            var style = new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                externalGraphic: "${icon}",
                graphicOpacity: 1,
                pointRadius: 15,
                graphicHeight: "{height}",
                graphicWidth: "{width",
                graphicYOffset: context.sandbox.mapConfiguration.markerIcons.default.graphicYOffset || 0
            }, OpenLayers.Feature.Vector.style["default"]), {
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
        }
    };

    function populateRules() {
        var lowRule,
            midRule,
            highRule,
            noClusterRule;

        lowRule = new OpenLayers.Rule({
            filter : new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.LESS_THAN,
                property: "count",
                value: 10
            }),
            symbolizer: config.symbolizers.lowSymbolizer
        });

        midRule = new OpenLayers.Rule({
            filter : new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.BETWEEN,
                property: "count",
                lowerBoundary: 10,
                upperBoundary: 99
            }),
            symbolizer: config.symbolizers.midSymbolizer
        });

        highRule = new OpenLayers.Rule({
            filter : new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.GREATER_THAN,
                property: "count",
                value: 99
            }),
            symbolizer: config.symbolizers.highSymbolizer
        });

        noClusterRule = new OpenLayers.Rule({
            filter : new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.GREATER_THAN,
                property: "height",
                value: 0
            }),
            symbolizer: config.symbolizers.noClusterSymbolizer
        });

        rules.push(lowRule, midRule, highRule, noClusterRule);

    }

    /**
     * Change the default clustering logic to use our own
     * Does not cluster polygons (leaves them unclustered and visible)
     */
    function overrideDefaultClustering() {

        // Override
        OpenLayers.Strategy.Cluster.prototype.cacheFeatures = function(event) {
            var propagate = true;
            if(!this.clustering) {
                //this.clearCache();
                if(this.features === null) {
                    this.features = [];
                }
                this.features = this.features.concat(event.features);
                this.cluster();
                propagate = false;
            }
            return propagate;
        };

        // New Function
        OpenLayers.Strategy.Cluster.prototype.recluster = function() {
            var event={"recluster":true};
            this.cluster(event);
        };

        // Override
        OpenLayers.Strategy.Cluster.prototype.cluster = function(event) {
            if((event && event.recluster) || !event || resolution != this.resolution || !this.clustersExist()) {
                var i,
                    j,
                    feature,
                    clustered,
                    cluster,
                    clone,
                    candidate,
                    clusters = [],
                    resolution = this.layer.map.getResolution();

                if((event && event.recluster) || resolution != this.resolution || !this.clustersExist()) {
                    this.resolution = resolution;
                    if (this.features) {
                        for(i=0; i<this.features.length; ++i) {
                            feature = this.features[i];
                            if(feature.geometry) {
                                if(
                                    feature.geometry.CLASS_NAME === 'OpenLayers.Geometry.Point' &&
                                    context.sandbox.stateManager.getFeatureVisibility({
                                        "layerId": this.layer.layerId,
                                        "featureId": feature.featureId
                                    })
                                ){
                                    clustered = false;
                                    for(j=clusters.length-1; j>=0; --j) {
                                        cluster = clusters[j];
                                        if( cluster.geometry.CLASS_NAME !== 'OpenLayers.Geometry.Point' &&
                                            this.shouldCluster(cluster, feature)) {
                                            this.addToCluster(cluster, feature);
                                            clustered = true;
                                            break;
                                        }
                                    }
                                    if(!clustered) {
                                        clusters.push(this.createCluster(this.features[i]));
                                    }
                                } else {
                                    if(
                                        context.sandbox.stateManager.getFeatureVisibility({
                                            "layerId": this.layer.layerId,
                                            "featureId": feature.featureId
                                        })
                                    ){
                                        clusters.push(this.createCluster(this.features[i]));
                                    }
                                }

                            }
                        }
                    }
                    this.clustering = true;
                    this.layer.removeAllFeatures();
                    this.clustering = false;
                    if(clusters.length > 0) {
                        if(this.threshold > 1) {
                            clone = clusters.slice();
                            clusters = [];
                            for(i=0, len=clone.length; i<len; ++i) {
                                candidate = clone[i];
                                if(candidate.attributes.count < this.threshold) {
                                    Array.prototype.push.apply(clusters, candidate.cluster);
                                } else {
                                    clusters.push(candidate);
                                }
                            }
                        }
                        this.clustering = true;
                        // A legitimate feature addition could occur during this
                        // addFeatures call.  For clustering to behave well, features
                        // should be removed from a layer before requesting a new batch.
                        this.layer.addFeatures(clusters);
                        this.clustering = false;
                    }
                    this.clusters = clusters;
                }
            }
        };
    }

    return exposed;
});
