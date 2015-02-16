define([
	'./cmapi-view-publisher'
], function (publisher) {
	var context,
        sendError,
        defaultLayerId;

    var exposed = {
        init: function(thisContext, errorChannel, emit) {
            context = thisContext;
            sendError = errorChannel;
            defaultLayerId = context.sandbox.cmapi.defaultLayerId;
            publisher.init(context);
        },
        receive: function(channel, message) {
            if(receiveChannels[channel]) {
                receiveChannels[ context.sandbox.cmapi.utils.createChannelNameFunction(channel)](message);
            } else {
                sendError(channel, message, 'Channel not supported');
            }
        }
    };

    var receiveChannels= {
        mapViewZoom: function(message) {
			sendError('map.view.zoom', message, 'channel not supported');
		},
        mapViewZoomIn: function(message) {
            publisher.zoomIn();
        },
        mapViewZoomOut: function(message) {
            publisher.zoomOut();
        },
        mapViewZoomMaxExtent: function(message) {
            publisher.zoomMaxExtent();
        },
        mapViewCenterOverlay: function(message) {
            var params = {};
            
            if('range' in message) {
                params.layerId = message.overlayId;
            } else {
                params.layerId = defaultLayerId;
            }
            
            //defaulting auto zoom to null since we dont support zooming into a certain range
            params.zoom = null; // 
            publisher.zoomToLayer(params);
		},
		mapViewCenterFeature: function(message) {
            var newAJAX;
            
            //check for required fields (featureId)
            if(message !== '' && message !== undefined) {
                if(!('featureId' in message)) {
                    sendError('map.view.center.feature', message, 'message must include a featureId');
                    return;
                }
            }

            newAJAX = context.sandbox.dataStorage.getFeatureById(message, function(data) {
                var extent;
                //If the feature is a point, set center; else, zoom to extent
               if(data.geometry.type === "Point") {
                   publisher.setCenter({
                        "lon": data.geometry.coordinates[1],
                        "lat": data.geometry.coordinates[0]
                    });
                } else { //if feature is any other geometry 
                    extent = context.sandbox.cmapi.getMaxExtent(data.geometry.coordinates);
                    publisher.centerOnBounds(extent);
                }
            });

            context.sandbox.ajax.addActiveAJAX({
                "newAJAX": newAJAX, 
                "layerId": layerId
            }); //keep track of current AJAX calls
		},
		maViewCenterLocation: function(message) {
			if('location' in message &&
				'lat' in message.location &&
				'lon' in message.location){
				publisher.setCenter(message.location);
			} else {
                sendError('map.view.center.location', message, 'Requires "location":{"lat", "lon"}');
            }
		},
		mapViewCenterBounds: function(message){
            var bounds;

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

            bounds = {
                "minLon": message.bounds.southWest.lon,
                "minLat": message.bounds.southWest.lat,
                "maxLon": message.bounds.northEast.lon,
                "maxLat": message.bounds.northEast.lat
            };

            publisher.publishCenterOnBounds(bounds);
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

            //Add some padding
            minLatDelta = Math.abs(extent.minLat) * 0.25;
            minLonDelta = Math.abs(extent.minLon) * 0.25;
            maxLatDelta = Math.abs(extent.maxLat) * 0.25;
            maxLonDelta = Math.abs(extent.maxLon) * 0.25;

            publisher.publishCenterOnBounds({
                "minLat": extent.minLat - minLatDelta,
                "minLon": extent.minLon - minLonDelta,
                "maxLat": extent.maxLat + maxLatDelta,
                "maxLon": extent.maxLon + maxLonDelta
            });
        },
		mapViewClicked: function(message){
            sendError('map.view.clicked', message, 'channel not supported');
        } 
    };

    return exposed;
});