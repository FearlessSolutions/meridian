define([
	'./cmapi-feature-mediator'
], function (mediator) {
	var context,
		defaultLayerId,
        sendError,
        emit,
        exposed,
        receiveChannels;

    exposed = {
        init: function(thisContext, errorChannel) {
            context = thisContext;
            defaultLayerId = context.sandbox.cmapi.defaultLayerId;
            sendError = errorChannel;
            mediator.init(context, exposed);
        },
        receive: function(channel, message) {
            var chName  = context.sandbox.cmapi.utils.createChannelNameFunction(channel);
            if(receiveChannels[chName]) {
                receiveChannels[chName](message, channel);
            } else {
                sendError(channel, message, 'Channel not supported');
            }
        },
        emit: function(channel, message) {
            emit(channel, message);
        }
    };

    //Map channels to functions, and error if a channel is not supported
    receiveChannels= {
		mapFeaturePlot: function(message) { // TODO: if featureId already exists, remove it and replot
            if(message === '') {
                sendError(channel, message, 'No message payload supplied');
            }else{
                plotFeatures(message);
            }
		},
        mapFeaturePlotBatch: function(message, channel) {
            sendError(channel, message, 'Channel not supported');
        },
		mapFeaturePlotUrl: function(message, channel) {
            sendError(channel, message, 'Channel not supported');
        },
		mapFeatureUnplot: function(message, channel) {
            sendError(channel, message, 'Channel not supported');
		},
		mapFeatureHide: function(message, channel) {
            sendError(channel, message, 'Channel not supported');
        },
		mapFeatureShow: function(message) {
            sendError(channel, message, 'Channel not supported');
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
        var layerId = message.overlayId || context.sandbox.cmapi.defaultLayerId;

        //check if layer exsist, if not create it
        if(!context.sandbox.dataStorage.datasets[layerId]) {
            //create new layer with overlayId provided

            context.sandbox.dataStorage.datasets[layerId] = new Backbone.Collection();
            context.sandbox.dataStorage.datasets[layerId].dataService = context.sandbox.cmapi.DATASOURCE_NAME;
            context.sandbox.dataStorage.datasets[layerId].layerName = message.name || layerId;

            mediator.createLayer({
                layerId: layerId,
                selectable: false //TODO remove when select is re-implemented
            });    
        }
        
        //plot feature(s) from payload
        mediator.plotFeatures({
            layerId: layerId,
            data: message.feature.features
        });    

        //zoom to feature if specified in payload
        if(message.zoom) {
            mediator.zoomToFeatures({
                layerId: layerId
            });
        }
    }

    return exposed;

});