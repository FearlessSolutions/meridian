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
        var layerId = message.overlayId || context.sandbox.cmapi.defaultLayerId,
            featureIndex,
            fId,
            sessionId = context.sandbox.sessionId,
            DATASOURCE_NAME = 'cmapi',
            //new
            newData = [],
            keys = context.sandbox.cmapi.keys,
            newKeys = {};

        //check if layer exist, if not create it
        if(!context.sandbox.dataStorage.datasets[layerId]) {
            //create new layer with overlayId provided

            context.sandbox.dataStorage.datasets[layerId] = new Backbone.Collection();
            context.sandbox.dataStorage.datasets[layerId].dataService = context.sandbox.cmapi.DATASOURCE_NAME;
            context.sandbox.dataStorage.datasets[layerId].layerName = message.name || layerId;

            mediator.createLayer({
                layerId: layerId,
                //selectable: false //TODO remove when select is re-implemented
                // new
                name: message.name || layerId,
                selectable: true,
                coords: message.coords
            });    
        }

        context.sandbox.stateManager.setLayerStateById({
            layerId: layerId,
            state: {
                dataTransferState: 'running'
            }
        });

        featureIndex = message.feature.features;

        context.sandbox.utils.each(featureIndex, function(dataindex, feature) {
            if(!feature.properties){
                feature.properties = {};
            }
            fId = feature.properties.featureId || context.sandbox.utils.UUID();
            fId += sessionId;
            var newValue = {
                // original
                //fId = feature.properties.featureId || context.sandbox.utils.UUID();
                //fId += sessionId;
                //
                //feature.id = fId;
                //feature.properties.featureId = fId;
                //feature.dataService = context.sandbox.cmapi.DATASOURCE_NAME;
                dataService: context.sandbox.cmapi.DATASOURCE_NAME,
                layerId: message.overlayId,
                id: fId,
                geometry: feature.geometry,
                type: feature.type,
                properties: feature.properties,
                lat: feature.geometry.coordinates[1],
                lon: feature.geometry.coordinates[0],
                featureId: fId
            }
            //console.debug(newValue);

            if(keys){
                //For each of the keys required, if that property exists in the feature, hoist it
                //and give it the specified header name
                context.sandbox.utils.each(keys, function(index, keyMetadata){
                    if(feature.properties[keyMetadata.property] !== undefined){
                        newValue[keyMetadata.property] = feature.properties[keyMetadata.property];
                        if(!newKeys[keyMetadata.property]){
                            newKeys[keyMetadata.property] = keyMetadata;
                        }
                    }
                });
            }

            //featureIndex[dataindex].dataService = 'cmapi';

            context.sandbox.dataStorage.addData({
                datasetId: layerId,
                data: newValue
            });

            // Add style properties for map features, but not for local dataset storage
            context.sandbox.utils.each(context.sandbox.icons.getIconForFeature(feature), function(styleKey, styleValue){
                newValue.properties[styleKey] = styleValue;
            });

            newData.push(newValue);
        });

        //Add new keys for the datagrid
        context.sandbox.dataStorage.insertKeys({
            keys: newKeys
        });

        // Clear data out from memory
        message = [];

        //plot feature(s) from payload
        mediator.plotFeatures({
            layerId: layerId,
            //data: message.feature.features
            data: newData
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