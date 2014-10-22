define([
	'./cmapi-overlay-publisher',	
	'./cmapi-overlay-subscriber'
], function (publisher, subscriber) {
	var context,
		defaultLayerId,
        sendError,
        DEFAULT_SELECTABLE = true;

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
        // *
        //  * Creates an overlay with given params.
        //  * If a layer already exists with the given id, that call is ignored
        //  * @param message
        //  * message.overlayId - The layerId for the new layer (optional)(default: 'cmapi')
        //  * message.name - The displayed name of the new layer (optional)(default: '')
        //  * message.selectable - If the features in the layer should be selectable (optional)(default: true)
        //  * message.bounds{maxLat:INT, maxLon:INT, minLat:INT, minLon:INT} - The AOI box to be created with the layer (optional)
         
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
                context.sandbox.dataStorage.datasets[message.layerId].dataService = context.sandbox.cmapi.DATASOURCE_NAME;

                publisher.publishCreateLayer({
                    "layerId": message.layerId,
                    "name": message.name,
                    "selectable": message.selectable,
                    "coords": message.coords,
                    // Temporary overwrite of symbolizers
                    "symbolizers": message.symbolizers,
                    "styleMap": message.styleMap
                });

                publisher.publishMessage({
                    messageType: 'success',
                    messageTitle: 'Layer Management',
                    messageText: 'A new layer has been created.'
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