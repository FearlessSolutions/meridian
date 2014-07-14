define([
	'./cmapi-overlay-publisher',	
	'./cmapi-overlay-subscriber'
], function (publisher, subscriber) {
	var context,
		defaultLayerId,
        DEFAULT_SELECTABLE = true;

    var receiveChannels= {
		"map.overlay.create": function(message){
			if(message === '') {
				message = {
					"layerId": defaultLayerId,
                    "selectable": DEFAULT_SELECTABLE
				};
			}else{
                message.layerId = message.overlayId || defaultLayerId; //Ensure that there is a layerId
                message.selectable = message.selectable || DEFAULT_SELECTABLE;
            }

            if(context.sandbox.dataStorage.datasets[message.layerId]){
                return; //Layer already made; ignore this request
                //TODO call error?
            }else{
                context.sandbox.dataStorage.datasets[message.layerId] = new Backbone.Collection();
                publisher.publishCreateLayer(message);
            }
		},
		"map.overlay.remove": function(message){
            message.layerId = message.overlayId || defaultLayerId;
            publisher.publishRemoveLayer(message);
		},
		"map.overlay.hide": function(message){
			message.layerId = message.overlayId || defaultLayerId;
			publisher.publishHideLayer(message);
		},
		"map.overlay.show": function(message){
			message.layerId = message.overlayId || defaultLayerId;
			publisher.publishShowLayer(message);
		},
		"map.overlay.update": function(message){
			//TODO don't support?
		}
    };

	var exposed = {
		init: function(thisContext, layerId) {
			context = thisContext;
			defaultLayerId = layerId;
            publisher.init(context);
            subscriber.init(context, exposed);
        },
        receive: function(channel, message){
        	if(receiveChannels[channel]){
        		receiveChannels[channel](message);
        	}else{
        		//error?
        	}
        }
	}

    return exposed;
});