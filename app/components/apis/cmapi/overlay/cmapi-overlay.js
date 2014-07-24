define([
	'./cmapi-overlay-publisher',	
	'./cmapi-overlay-subscriber'
], function (publisher, subscriber) {
	var context,
		defaultLayerId,
        sendError,
        DEFAULT_SELECTABLE = true;

    var exposed = {
        init: function(thisContext, layerId, errorChannel) {
            context = thisContext;
            defaultLayerId = layerId;
            sendError = errorChannel;
            publisher.init(context);
            subscriber.init(context, exposed);
        },
        receive: function(channel, message) {
            if(receiveChannels[channel]) {
                receiveChannels[channel](message);
            } else {
                sendError(channel, message, 'Channel not supported');
            }
        }
    };

    var receiveChannels = {
        /**
         * Creates an overlay with given params.
         * If a layer already exists with the given id, that call is ignored
         * @param message
         * message.overlayId - The layerId for the new layer (optional)(default: 'cmapi')
         * message.name - The displayed name of the new layer (optional)(default: '')
         * message.selectable - If the features in the layer should be selectable (optional)(default: true)
         * message.bounds{maxLat:INT, maxLon:INT, minLat:INT, minLon:INT} - The AOI box to be created with the layer (optional)
         */
		"map.overlay.create": function(message) {
			if(message === '') {
				message = {
					"layerId": defaultLayerId,
                    "selectable": DEFAULT_SELECTABLE
				};
			} else {
                message.layerId = message.overlayId || defaultLayerId; //Ensure that there is a layerId
                if(!('selectable' in message)) {
                    message.selectable = DEFAULT_SELECTABLE;
                }
            }

            if(context.sandbox.dataStorage.datasets[message.layerId]) {
                sendError('map.overlay.create', message, 'Layer already made');
                return; //Layer already made; ignore this request
            } else {
                context.sandbox.dataStorage.datasets[message.layerId] = new Backbone.Collection();

                //***** HACK *****
                var config = {
                    "symbolizers": {
                        "lowSymbolizer": {
                          "fillColor": "rgb(0, 0, 0)",
                          "fillOpacity": 0.9,
                          "strokeColor": "rgb(0, 0, 0)",
                          "strokeOpacity": 0.5,
                          "strokeWidth": 12,
                          "pointRadius": 10,
                          "label": "${count}",
                          "labelOutlineWidth": 1,
                          "labelYOffset": 0,
                          "fontColor": "#ffffff",
                          "fontOpacity": 0.8,
                          "fontSize": "12px"
                        },
                        "midSymbolizer": {
                          "fillColor": "rgb(0, 0, 0)",
                          "fillOpacity": 0.9,
                          "strokeColor": "rgb(0, 0, 0)",
                          "strokeOpacity": 0.5,
                          "strokeWidth": 12,
                          "pointRadius": 15,
                          "label": "${count}",
                          "labelOutlineWidth": 1,
                          "labelYOffset": 0,
                          "fontColor": "#ffffff",
                          "fontOpacity": 0.8,
                          "fontSize": "12px"
                        },
                        "highSymbolizer": {
                          "fillColor": "rgb(0, 0, 0)",
                          "fillOpacity": 0.9,
                          "strokeColor": "rgb(0, 0, 0)",
                          "strokeOpacity": 0.5,
                          "strokeWidth": 12,
                          "pointRadius": 20,
                          "label": "${count}",
                          "labelOutlineWidth": 1,
                          "labelYOffset": 0,
                          "fontColor": "#ffffff",
                          "fontOpacity": 0.8,
                          "fontSize": "12px"
                        },
                        "noClusterSymbolizer": {
                          "externalGraphic": "${icon}",
                          "graphicOpacity": 1,
                          "pointRadius": 15,
                          "graphicHeight": "${height}",
                          "graphicWidth": "${width}"
                        }
                    }
                };
                
                var rules = [],
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
                // ***** END HACK *****

                publisher.publishCreateLayer({
                    "layerId": message.layerId,
                    "name": message.name,
                    "selectable": message.selectable,
                    "coords": message.coords,
                    //"styleMap": message.styleMap || ""
                    // ***** HACK *****
                    "styleMap": {
                       "default": style,
                       "select": style
                    }
                });

            }
		},
        /**
         * Removes overlay with the given id.
         * If no such layer exists, the call is ignored
         * @param message
         * message.overlayId - The layer id of the layer (optional)(default: 'cmapi')
         */
		"map.overlay.remove": function(message) {
            publisher.publishRemoveLayer({
                "layerId": message.overlayId || defaultLayerId
            });
		},
        /**
         * Hides overlay with the given id.
         * If no such layer exists, the call is ignored
         * @param message
         * message.overlayId - The layer id of the layer (optional)(default: 'cmapi')
         */
		"map.overlay.hide": function(message) {
            context.sandbox.stateManager.layers[message.overlayId].visible = false;
			publisher.publishHideLayer({
                "layerId": message.overlayId || defaultLayerId
            });
		},
        /**
         * Removes overlay with the given id.
         * If no such layer exists, the call is ignored
         * @param message
         * message.overlayId - The layer id of the layer (optional)(default: 'cmapi')
         */
		"map.overlay.show": function(message) {
            context.sandbox.stateManager.layers[message.overlayId].visible = true;
			publisher.publishShowLayer({
                "layerId": message.overlayId || defaultLayerId
            });
		},
        /**
         * @notImplemented
         * @param message
         */
		"map.overlay.update": function(message) {
            sendError('map.overlay.update', message, 'Channel not supported');
        }
    };

    return exposed;
});