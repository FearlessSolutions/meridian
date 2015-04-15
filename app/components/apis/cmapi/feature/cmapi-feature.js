define([
	'./cmapi-feature-mediator',	
], function (mediator) {
	var context,
		defaultLayerId,
        sendError,
        emit;

    var exposed = {
        init: function(thisContext, errorChannel) {
            context = thisContext;
            defaultLayerId = context.sandbox.cmapi.defaultLayerId;
            sendError = errorChannel;
            mediator.init(context, exposed);
        },
        receive: function(channel, message) {
            var chName  = context.sandbox.cmapi.utils.createChannelNameFunction(channel);
            if(receiveChannels[chName]) {
                receiveChannels[chName](message);
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
		mapFeaturePlot: function(message) { // TODO: if featureId already exists, remove it and replot
            if(message === '') {
                sendError(channel, message, 'No message payload supplied');
            }else{
                plotFeatures(message);
            }
		},
        mapFeaturePlotBatch: function(message) {
            if(message === '') {
                sendError(channel, message, 'No message payload supplied');
            } else {
                //plot all features in payload
                plotFeaturesByURL(message);
            }
        },
		mapFeaturePlotUrl: function(message) {
            if(message === '') {
                sendError(channel, message, 'No message payload supplied');
            } else {
                sendError(channel, message, 'Channel not supported');
            }
		},
		mapFeatureUnplot: function(message) {
            if(message === '') {
                sendError(channel, message, 'No message payload supplied');
            } else {
                unplotFeatures(message);
            }
		},
		mapFeatureHide: function(message) {
            if(message === '') {
                return;
            } else if(!message.format || message.format === 'geojson') {
                context.sandbox.stateManager.addHiddenFeaturesByLayerId({
                    layerId: message.overlayId,
                    featureIds: [message.featureId]
                });
                mediator.publishHideFeatures({
                    layerId: message.overlayId,
                    featureIds: [message.featureId]
                });
            } else if(message.format === 'kml') {
                sendError('map.feature.unplot', message, 'KML is not currently supported');
            } else {
                sendError('map.feature.unplot', message, 'GeoJSON is the only supported format, for now.');
            }
		},
		mapFeatureShow: function(message) {
            if(message === '') {
                return;
            } else if(!message.format || message.format === 'geojson') {
                context.sandbox.stateManager.removeHiddenFeaturesByLayerId({
                    "layerId": message.overlayId,
                    "featureIds": [message.featureId]
                });
                mediator.publishShowFeatures({
                    "layerId": message.overlayId,
                    "featureIds": [message.featureId]
                });
                if(message.zoom) {
                    mediator.publishZoomToFeatures({
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
		mapFeatureSelected: function(message) {
            sendError('map.feature.selected', message, 'Channel not supported');
		},
		mapFeatureDeselected: function(message) {
            sendError('map.feature.deselected', message, 'Channel not supported');
		},
		mapFeatureUpdate: function(message) {
            sendError('map.feature.update', message, 'Channel not supported');
		}
    };

    function plotFeatures(message) {
        //check if layer exsist, if not create it
        if(!context.sandbox.dataStorage.datasets[message.overlayId]) {
            //create new layer with overlayId provided
            mediator.createLayer({
                layerId: message.overlayId,
            });    
        }
        //plot feature(s) from payload
        mediator.plotFeatures({
            layerId: message.overlayId,
            data: message.feature.features
        });    

        //zoom to feature if specified in payload
        if(message.zoom) {
            mediator.zoomToFeatures({
                "layerId": message.overlayId,
            });
        }

    }

    return exposed;

});