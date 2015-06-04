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
            if(message === '') {
                sendError(channel, message, 'No message payload supplied');
            }else{
                plotFeatures(message);
            }
        },
        mapFeaturePlotUrl: function(message, channel) {
            sendError(channel, message, 'Channel not supported');
        },
        mapFeatureUnplot: function(message, channel) {
            sendError(channel, message, 'Channel not supported');
        },
        mapFeatureHide: function(message, channel) {
            if(message === '') {
                sendError(channel, message, 'No message payload supplied');
            }else{
                hideFeatures(message);
            }
        },
        mapFeatureShow: function(message) {
            if(message === '') {
                sendError(channel, message, 'No message payload supplied');
            }else{
                showFeatures(message);
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
        var layerId = message.overlayId || context.sandbox.cmapi.defaultLayerId,
            featureIndex,
            fId,
            sessionId = context.sandbox.sessionId,
            newData = [],
            newKeys = {};
        layerId += sessionId;

        //check if layer exists, if not create it
        if(!context.sandbox.dataStorage.datasets[layerId]) {
            //create new layer with overlayId provided
            context.sandbox.dataStorage.datasets[layerId] = new Backbone.Collection();
            context.sandbox.dataStorage.datasets[layerId].dataService = context.sandbox.cmapi.DATASOURCE_NAME;
            context.sandbox.dataStorage.datasets[layerId].layerName = message.name || layerId;

            mediator.createLayer({
                layerId: layerId,
                name: message.name || layerId,
                selectable: false,
                //selectable: true, //TODO This will only work if 1) we keep renderer as is, and save it to server OR 2) we change the renderer
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
            var newValue;
            if(!feature.properties){
                feature.properties = {};
            }
            fId = feature.properties.featureId || context.sandbox.utils.UUID();
            fId += sessionId; //Make it unique over different sessions.

            newValue = {
                dataService: context.sandbox.cmapi.DATASOURCE_NAME,
                id: fId,
                geometry: feature.geometry,
                type: feature.type,
                properties: feature.properties,
                featureId: fId
            };

            context.sandbox.utils.each(feature.properties, function(key, value){
                newValue[key] = value;

                if(!newKeys[key]){
                    newKeys[key] = {
                        property: key,
                        displayName: key,
                        weight: 50
                    }
                }
            });

            if(feature.geometry.type === 'Point') {
                // Adding fields for lat/lon for other components to use
                newValue.lat = feature.geometry.coordinates[1];
                newValue.lon = feature.geometry.coordinates[0];
            } else {
                newValue.lat = 'N/A';
                newValue.lon = 'N/A';
            }

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
            data: newData
        });

        //zoom to feature if specified in payload
        if(message.zoom) {
            mediator.zoomToFeatures({
                layerId: layerId
            });
        }
    }
    function hideFeatures(message) {
        var layerId = message.overlayId || context.sandbox.cmapi.defaultLayerId,
            featureIndex,
            fId,
            newData = [],
            sessionId = context.sandbox.sessionId;
        layerId += sessionId;

        context.sandbox.stateManager.setLayerStateById({
            layerId: layerId,
            state: {
                dataTransferState: 'running'
            }
        });

        featureIndex = message.featureIds;
        context.sandbox.utils.each(featureIndex, function(dataindex, feature) {
            fId = feature + sessionId;


            context.sandbox.dataStorage.addData({
                datasetId: layerId,
                data: fId
            });

            newData.push(fId);
        });

        // Clear data out from memory
        message = [];  // not sure why intellij says it's unused

        //plot feature(s) from payload
        mediator.hideFeatures({
            layerId: layerId,
            featureIds: newData,
            exclusive: false
        });

    }

    function showFeatures(message) {
        var layerId = message.overlayId || context.sandbox.cmapi.defaultLayerId,
            featureIndex,
            fId,
            newData = [],
            sessionId = context.sandbox.sessionId;
        layerId += sessionId;

        context.sandbox.stateManager.setLayerStateById({
            layerId: layerId,
            state: {
                dataTransferState: 'running'
            }
        });

        featureIndex = message.featureIds;
        context.sandbox.utils.each(featureIndex, function(dataindex, feature) {
            fId = feature + sessionId;


            context.sandbox.dataStorage.addData({
                datasetId: layerId,
                data: fId
            });

            newData.push(fId);
        });

        //plot feature(s) from payload
        mediator.showFeatures({
            layerId: layerId,
            featureIds: newData,
            exclusive: false
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