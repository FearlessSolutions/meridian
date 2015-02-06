define([], function() {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    // Set Full-Scope Variables
    var config,
        rules = [],
        layerOptionsCollection = [],
        CLUSTER_MODE = 'cluster',
        FEATURE_MODE = 'feature',
        HEAT_MODE = 'heatmap',
        AOI_TYPE = 'aoi',
        STATIC_TYPE = 'static',
        LAYERID_SUFFIX = '_cluster',
        cache;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            config = context.sandbox.mapConfiguration.clustering;
            cache = {};
//            populateRules();

        },
        enable: function(params) {
            var map = params.map;

            map.getLayers().forEach(function(layer, layerIndex, layerArray){
                var layerType = layer.get('layerType');
                if (layerType === CLUSTER_MODE
                    || layerType === STATIC_TYPE
                    || layerType === AOI_TYPE){
                    layer.setVisible(true);
                }
            });
        },
        disable: function(params) {
            var map = params.map;

            map.getLayers().forEach(function(layer, layerIndex, layerArray){
                var layerType = layer.get('layerType');
                if (layerType === CLUSTER_MODE){
                    layer.setVisible(false);
                }
            });
        },
        update: function(params) {
//            var visibility = false,
//                visualMode = context.sandbox.stateManager.map.visualMode;
//
//            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(layerId, collections) {
//                if(visualMode === 'cluster' || visualMode === 'feature') {
//                    visibility = context.sandbox.stateManager.layers[layerId].visible;
//                }
//                params.map.getLayersBy('layerId', layerId)[0].setVisibility(visibility);
//            });
        },
        recluster: function(params) {
//            var layer =  params.map.getLayersBy('layerId', params.layerId)[0];
//            layer.recluster();
        },
        clear: function() {
            layerOptionsCollection = [];
        },
        setupClusteringForLayer: function(params, geoSource, featureStyle){
            var layerId = params.layerId,
                map = params.map,
                clusterSource,
                newClusterLayer;

            clusterSource = new ol.source.Cluster({
                distance: 40,
                source: geoSource
            });

            cache[layerId] = {
                clusterStyleFunction: clusterStyling,
                featureStyleFunction: featureStyle,
                styleCache: {}
            };

            newClusterLayer = new ol.layer.Vector({
                layerId: layerId + LAYERID_SUFFIX,
                layerType: CLUSTER_MODE,
                source: clusterSource,
                style: clusterStyling,
                visible: context.sandbox.stateManager.map.visualMode === CLUSTER_MODE
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


    function clusterStyling(feature, resolution){
        var cluster = feature.get('features'),
            size =  cluster.length,
            layerId = cluster[0].get('layerId'),
            style = cache[layerId].styleCache[size];

        if (!style) {
            if(size === 1){
                style = cache[layerId].featureStyleFunction(cluster[0], resolution);
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
                cache[layerId].styleCache[size] = style; //This is only done for size > 1 because 1 is handled by feature
            }
        }
        return style;
    }

    return exposed;
});
