define([
	'./cmapi-overlay-publisher',	
	'./cmapi-overlay-subscriber'
], function (publisher, subscriber) {
	var context,
		defaultLayerId,
        sendError,

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
            var layerId =  message.overlayId || defaultLayerId, selectable, symbolizers, styleMap;
            
            if(context.sandbox.dataStorage.datasets[layerId]) {
                sendError('map.overlay.create', message, 'Layer' +  layerId + ' has already been created');
                return;
            } else {
                context.sandbox.dataStorage.datasets[layerId] = new Backbone.Collection();
                context.sandbox.dataStorage.datasets[layerId].dataService = context.sandbox.cmapi.DATASOURCE_NAME; //deafults dataservice name to CMAPI
                context.sandbox.dataStorage.datasets[layerId].layerName = message.name || layerId;

                //grab additional properties for layer creation
                if(message.properties){
                    if(message.properties.selectable){ selectable = message.properties.selectable; }
                    if(message.properties.symbolizers){ symbolizers = message.properties.symbolizers; }
                    if(message.properties.styleMap){ styleMap = message.properties.styleMap; }
                }
                try{
                    publisher.publishCreateLayer({
                        layerId: layerId,
                        name: message.name,
                        selectable: selectable || false,
                        symbolizers: symbolizers || null,
                        styleMap: styleMap || null;
                    });

                    publisher.publishMessage({
                        messageType: 'success',
                        messageTitle: 'Layer Management',
                        messageText: 'A new layer has been created.'
                    });
                } catch (parseE) {
                    publisher.publishMessage({
                        messageType: 'error',
                        messageTitle: 'Layer Management',
                        messageText: 'Failed to create layer with ID: ' +  layerId;
                    });
                }
            }
		},
        /**
         * Removes overlay with the given id.
         * If no such layer exists, the call is ignored
         * @param message
         * message.overlayId - The layer id of the layer (optional)(default: 'cmapi')
         */
		"map.overlay.remove": function(message) {
            var layerId =  message.overlayId || defaultLayerId;

            publisher.publishRemoveLayer({
                layerId: layerId
            });
        },
        /**
         * Hides overlay with the given id.
         * If no such layer exists, the call is ignored
         * @param message
         * message.overlayId - The layer id of the layer (optional)(default: 'cmapi')
         */
		"map.overlay.hide": function(message) {
            var layerId =  message.overlayId || defaultLayerId;

            context.sandbox.stateManager.layers[layerId].visible = false;
			publisher.publishHideLayer({
                layerId: layerId
            });
		},
        /**
         * Removes overlay with the given id.
         * If no such layer exists, the call is ignored
         * @param message
         * message.overlayId - The layer id of the layer (optional)(default: 'cmapi')
         */
		"map.overlay.show": function(message) {
            var layerId =  message.overlayId || defaultLayerId;

            context.sandbox.stateManager.layers[layerId].visible = true;
			publisher.publishShowLayer({
                layerId: layerId
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