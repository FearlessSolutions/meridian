define([
	'./cmapi-overlay-mediator'
], function (mediator) {
	var context,
		defaultLayerId,
        sendError,
        DEFAULT_SELECTABLE = true, //TODO
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
            if(receiveChannels[channel]) {
                receiveChannels[channel](message);
            } else {
                sendError(channel, message, 'Channel not supported');
            }
        }
    };

    receiveChannels = {
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
            var layerId =  message.overlayId || defaultLayerId;

            //TODO Selectable functionality was removed. Add it back.
			if(message === '') {
				message = {
//                    selectable: DEFAULT_SELECTABLE //TODO
                    selectable: false
				};
			} else {
                message.selectable = false;
//                if(!('selectable' in message)) { //TODO
//                    message.selectable = DEFAULT_SELECTABLE;
//                }
            }

            if(context.sandbox.dataStorage.datasets[layerId]) {
                sendError('map.overlay.create', message, 'Layer already made');
            } else {
                context.sandbox.dataStorage.datasets[layerId] = new Backbone.Collection();
                context.sandbox.dataStorage.datasets[layerId].dataService = context.sandbox.cmapi.DATASOURCE_NAME;
                context.sandbox.dataStorage.datasets[layerId].layerName = message.name || layerId;


                mediator.publishCreateLayer({
                    layerId: layerId,
                    name: message.name,
                    selectable: message.selectable,
                    coords: message.coords,
                    // Temporary overwrite of symbolizers
                    symbolizers: message.symbolizers,
                    styleMap: message.styleMap
                });

                mediator.publishMessage({
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
            var layerId =  message.overlayId || defaultLayerId;

            mediator.publishRemoveLayer({
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
			mediator.publishHideLayer({
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
			mediator.publishShowLayer({
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