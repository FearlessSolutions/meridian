define([
	'./cmapi-basemap-mediator'
], function (mediator) {
	var context,
        sendError,
        receiveChannels;

    receiveChannels = {
        /**
         * Changes the basemap of the map.
         * If a basemap does not exist, use default
         * If a specified basemap doesn't exist, throw error
         * @param message
         * message.basemap - The basemap id
         */
		"map.basemap.change": function(message) {
			var basemapId = message.basemap,
                basemapExists = false,
                mapConfiguration = context.sandbox.mapConfiguration;

            if(!basemapId){
                basemapId = mapConfiguration.defaultBaseMap;
                basemapExists = true;
            }else{
                //If a basemap was given, make sure it exists
                context.sandbox.utils.each(mapConfiguration.basemaps, function(basemapIndex, basemap){
                    if(basemap.basemap === basemapId){
                        basemapExists = true;
                    }
                });
            }

            if(basemapExists){
                mediator.changeBasemap({
                    basemap: basemapId
                });
            } else {
                sendError('map.basemap.create', message, 'Did not find basemap.');
            }
		}
    };

    return {
        init: function(thisContext, errorChannel) {
            context = thisContext;
            sendError = errorChannel;
            mediator.init(context);
        },
        receive: function(channel, message) {
            if(receiveChannels[channel]) {
                receiveChannels[channel](message);
            } else {
                sendError(channel, message, 'Channel not supported');
            }
        }
    };

});