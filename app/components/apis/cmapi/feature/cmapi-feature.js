define([
	'./cmapi-feature-publisher',	
	'./cmapi-feature-subscriber'
], function (publisher, subscriber) {
	var context,
		defaultLayerId,
        sendError,
        emit;

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
        },
        emit: function(channel, message) {
            emit(channel, message);
        }
    };

    //Map channels to functions, and error if a channel is not supported
    var receiveChannels= {
		"map.feature.plot": function(message) { // TODO: if featureId already exists, remove it and replot
            if(message === '') {
                return;
            } else if(!message.format || message.format === 'geojson') {
                plotGeoJSON(message);
            } else if(message.format === 'kml') {
                sendError('map.feature.unplot', message, 'KML is not currently supported');
            } else {
                sendError('map.feature.unplot', message, 'GeoJSON is the only supported format, for now.');
            }
		},
		"map.feature.plot.url": function(message) {
            sendError('map.feature.plot.url', message, 'Channel not supported');
		},
		"map.feature.unplot": function(message) {
            sendError('map.feature.unplot', message, 'Channel not supported');
		},
		"map.feature.hide": function(message) {
            if(message === '') {
                return;
            } else if(!message.format || message.format === 'geojson') {
                context.sandbox.stateManager.addHiddenFeaturesByLayerId({
                    "layerId": message.overlayId,
                    "featureIds": [message.featureId]
                });
                publisher.publishHideFeatures({
                    "layerId": message.overlayId,
                    "featureIds": [message.featureId]
                });
            } else if(message.format === 'kml') {
                sendError('map.feature.unplot', message, 'KML is not currently supported');
            } else {
                sendError('map.feature.unplot', message, 'GeoJSON is the only supported format, for now.');
            }
		},
		"map.feature.show": function(message) {
            if(message === '') {
                return;
            } else if(!message.format || message.format === 'geojson') {
                context.sandbox.stateManager.removeHiddenFeaturesByLayerId({
                    "layerId": message.overlayId,
                    "featureIds": [message.featureId]
                });
                publisher.publishShowFeatures({
                    "layerId": message.overlayId,
                    "featureIds": [message.featureId]
                });
                if(message.zoom) {
                    publisher.publishZoomToFeatures({
                        "layerId": message.overlayId,
                        "featureIds": [message.featureId]
                    });
                }
                // TODO: add support for CMAPI allowing you to zoom to the feature passed in
            } else if(message.format === 'kml') {
                sendError('map.feature.unplot', message, 'KML is not currently supported');
            } else {
                sendError('map.feature.unplot', message, 'GeoJSON is the only supported format, for now.');
            }
		},
		"map.feature.selected": function(message) {
            sendError('map.feature.selected', message, 'Channel not supported');
		},
		"map.feature.deselected": function(message) {
            sendError('map.feature.deselected', message, 'Channel not supported');
		},
		"map.feature.update": function(message) {
            sendError('map.feature.update', message, 'Channel not supported');
		}
    };

    /**
     * Plot passed in geoJSON
     * If geoJSON is trying to be put in a layer that doesn't exist
     * @param message
     * message =
     * {
        "overlayId":"STRING",           (optional)(default: 'cmapi'
        "format":"geojson",             (required)
        "feature":{                     (required)
            "type":"FeatureCollection"  (required),
            "features":[ (required) (this must be formatted as proper geoJSON features)
                {
                    "type":"Feature",
                    "geometry":{
                        "type":"Polygon",
                         "coordinates": [*]
                    },
                    "properties":{
                        "p1": "test prop 1"
                    }
                }
            ]
        },
        "name":"STRING",                (optional)(default: '')
        "zoom":"true",                  (optional)(default: true)
        "selectable":BOOLEAN            (optional)(default: true)
    }
     *Note that name and selectable will only be used if there was no overlay with the given id
     */
    function plotGeoJSON(message) {
        var postOptions,
            layerId;

        if(
            !message.feature ||
            !message.feature.features ||
            !Array.isArray(message.feature.features) ||
            message.feature.features.length === 0
        ){
            return false;
        }

        layerId = message.overlayId || defaultLayerId;

        if(!context.sandbox.dataStorage.datasets[layerId]) {
            context.sandbox.dataStorage.datasets[layerId] = new Backbone.Collection();

            publisher.publishCreateLayer({
                "layerId": layerId,
                "name": message.name || layerId,
                "selectable": ('selectable' in message) ? message.selectable : true,
                "coords": message.coords,
                // Temporary overwrite of symbolizers
                "symbolizers": message.symbolizers,
                "styleMap": message.styleMap
            });
        }

        postOptions = {
            "type": "POST",
            "url": context.sandbox.utils.getCurrentNodeJSEndpoint() + "/feature",
            "data": {
                "queryId": layerId,
                "data": message.feature.features
            },
            "xhrFields": {
                "withCredentials": true
            }
        };

        // Save the features and plot them.
        var newAJAX = context.sandbox.utils.ajax(postOptions)
            .done(function(data, status) {
                var newData = [],
                    featureIds = [];
                    
                if(status === "success") {
                    context.sandbox.utils.each(data, function(key, value){
                        var newValue = {};

                        newValue.dataService = 'cmapi';
                        newValue.id = value.featureId;
                        newValue.featureId = value.featureId;
                        newValue.layerId = value.queryId;
                        newValue.geometry = value.geometry;
                        newValue.type = value.type;
                        newValue.properties = {
                            "dataService": "cmapi"
                        };

                        context.sandbox.utils.each(value.properties, function(key, value){
                            newValue[key] = value;
                        });

                        delete newValue.queryId;

                        if(value.geometry.type === 'Point') {
                            // Adding fields for lat/lon for other components to use
                            newValue.lat = value.geometry.coordinates[1];
                            newValue.lon = value.geometry.coordinates[0];
                        } else {
                            newValue.lat = 'N/A';
                            newValue.lon = 'N/A';
                        }

                        context.sandbox.dataStorage.addData({
                            "datasetId": layerId,
                            "data": newValue
                        });

                        // Add style properties for map features, but not for local dataset storage
                        context.sandbox.utils.each(context.sandbox.icons.getIconForFeature(value), function(styleKey, styleValue){
                            newValue.properties[styleKey] = styleValue;
                        });

                        newData.push(newValue);
                    });

                    publisher.publishPlotFeature({
                        "layerId": layerId,
                        "data": newData
                    });

                    if(message.zoom === true) {
                        context.sandbox.utils.each(newData, function(k, v){
                            featureIds.push(v.featureId);
                        });
                        publisher.publishZoomToFeatures({
                            "layerId": layerId,
                            "featureIds": featureIds
                        });
                    } else if(message.dataZoom) {
                        var extent,
                            minLatDelta,
                            minLonDelta,
                            maxLatDelta,
                            maxLonDelta;

                        context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(datasetId, dataset){
                            dataset.each(function(feature){
                                extent = context.sandbox.cmapi.getMaxExtent(feature.attributes.geometry.coordinates, extent);
                            });
                        });

                        //Add some padding
                        minLatDelta = Math.abs(extent.minLat) * 0.25;
                        minLonDelta = Math.abs(extent.minLon) * 0.25;
                        maxLatDelta = Math.abs(extent.maxLat) * 0.25;
                        maxLonDelta = Math.abs(extent.maxLon) * 0.25;

                        publisher.publishCenterOnBounds({
                            "minLat": extent.minLat - minLatDelta,
                            "minLon": extent.minLon - minLonDelta,
                            "maxLat": extent.maxLat + maxLatDelta,
                            "maxLon": extent.maxLon + maxLonDelta
                        });
                    }

                    publisher.publishPlotFinish({"layerId": layerId});
                } else {
                    publisher.publishPlotError({"layerId": layerId});
                    sendError('map.feature.plot', message, 'No data plotted');

                }

            }).error(function() {
                publisher.publishPlotError({"layerId": layerId});
                sendError('map.feature.plot', message, 'Server not available or malformed geoJSON');

            });

        context.sandbox.ajax.addActiveAJAX({
            "newAJAX": newAJAX,
            "layerId": layerId
        });

        //TODO: collection-wide style map?
        //TODO: modify format more?

    }

    return exposed;

});