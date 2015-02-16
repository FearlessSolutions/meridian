define([
	'./cmapi-feature-publisher',	
	'./cmapi-feature-subscriber'
], function (publisher, subscriber) {
	var context,
		defaultLayerId,
        sendError,
        emit;

    var exposed = {
        init: function(thisContext, errorChannel) {
            context = thisContext;
            defaultLayerId = context.sandbox.cmapi.defaultLayerId;
            sendError = errorChannel;
            publisher.init(context);
            subscriber.init(context, exposed);
        },
        receive: function(channel, message) {
            if(receiveChannels[channel]) {
                receiveChannels[channel](channel, message);
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
		"map.feature.plot": function(channel, message) { // TODO: if featureId already exists, remove it and replot
            if(message === '') {
                sendError('map.feature.unplot', message, 'GeoJSON is the only supported format, for now.');
                return;
            }else{
                plotFeatures(message);
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
                    layerId: message.overlayId,
                    featureIds: [message.featureId]
                });
                publisher.publishHideFeatures({
                    layerId: message.overlayId,
                    featureIds: [message.featureId]
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

    function plotFeatures(message) {
        //check if layer exsist, if not create it
        if(!context.sandbox.dataStorage.datasets[message.overlayId]) {
            //create new layer with overlayId provided
            publisher.createLayer({
                layerId: message.overlayId,
            });    
        }
        //plot feature(s) from payload
        publisher.plotFeatures({
            layerId: message.overlayId,
            data: message.feature.features
        });    

        //zoom to feature if specified in payload
        if(message.zoom) {
            publisher.zoomToFeatures({
                "layerId": message.overlayId,
            });
        }
    }    

    return exposed;

});