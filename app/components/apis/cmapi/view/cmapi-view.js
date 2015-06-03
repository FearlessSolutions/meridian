define([
	'./cmapi-view-mediator'
], function (mediator) {
	var context,
        sendError,
        defaultLayerId;

    var exposed = {
        init: function(thisContext, errorChannel, emit) {
            context = thisContext;
            sendError = errorChannel;
            defaultLayerId = context.sandbox.cmapi.defaultLayerId;
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
        mapClick: function(message){
            var payload;
            
            if('lat' in message && 'lon' in message) {
                payload = {
                    lat: message.lat,
                    lon: message.lon,
                    button: 'left', //only supporting left click - TODO: need to revisit
                    type: 'single' //only supporting single click - TODO: need to revisit
                };
            } 
            context.sandbox.external.postMessageToParent({
                channel: 'map.view.clicked',
                message: payload
            });
        } 
    };

    var receiveChannels= {
        mapViewZoom: function(message) {
			sendError('map.view.zoom', message, 'channel not supported');
		},
        mapViewZoomIn: function(message) {
            mediator.zoomIn();
        },
        mapViewZoomOut: function(message) {
            mediator.zoomOut();
        },
        mapViewZoomMaxExtent: function(message) {
            mediator.zoomToMaxExtent();
        },
        mapViewCenterOverlay: function(message) {
            mediator.zoomToLayer({
                layerId: message.overlayId ? message.overlayId+=context.sandbox.sessionId : defaultLayerId,
                zoom: null //defaulting auto zoom to null since we dont support zooming into a certain range
            });
		},
        mapViewCenterFeature: function(message) {
            var layerId = message.overlayId || context.sandbox.cmapi.defaultLayerId,
                fId,
                sessionId = context.sandbox.sessionId;
            layerId += sessionId;
            fId = message.featureId + sessionId;

            mediator.zoomToFeatures({
                layerId: layerId,
                featureIds: fId
            });
        },
		mapViewCenterLocation: function(message) {
			if('location' in message && 'lat' in message.location && 'lon' in message.location){
				mediator.setCenter(message.location);
			} else {
                sendError('map.view.center.location', message, 'Requires "location":{"lat", "lon"}');
            }
		},
		mapViewCenterBounds: function(message){
            if(
                !message.bounds ||
                !message.bounds.northEast || 
                !('lat' in message.bounds.northEast) || 
                !('lon' in message.bounds.northEast) ||
                !message.bounds.southWest || 
                !('lat' in message.bounds.southWest) || 
                !('lon' in message.bounds.southWest)
            ){
                sendError('map.view.center.bounds', message, 'Requires "bounds" with northEast and southWest lat,lon');
                return;
            }

            mediator.centerOnBounds({
                minLon: message.bounds.southWest.lon,
                minLat: message.bounds.southWest.lat,
                maxLon: message.bounds.northEast.lon,
                maxLat: message.bounds.northEast.lat
            });
		},
        mapViewCenterData: function(message){
            var extent,
                minLatDelta,
                minLonDelta,
                maxLatDelta,
                maxLonDelta;

            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(datasetId, dataset){
                dataset.each(function(feature){
                    extent = context.sandbox.cmapi.getMaxExtent(feature.attributes.geometry.coordinates, extent);
                });
            });
            if(extent){
                 //Add some padding
                minLatDelta = Math.abs(extent.minLat) * 0.25;
                minLonDelta = Math.abs(extent.minLon) * 0.25;
                maxLatDelta = Math.abs(extent.maxLat) * 0.25;
                maxLonDelta = Math.abs(extent.maxLon) * 0.25;

                mediator.centerOnBounds({
                    minLat: extent.minLat - minLatDelta,
                    minLon: extent.minLon - minLonDelta,
                    maxLat: extent.maxLat + maxLatDelta,
                    maxLon: extent.maxLon + maxLonDelta
                });
            } else {
                context.sandbox.external.postMessageToParent({
                    channel: 'map.view.center.data',
                    message: 'message failure - no data present'
                });
            }
        }
    };

    return exposed;
});