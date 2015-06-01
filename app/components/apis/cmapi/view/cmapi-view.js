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
                layerId: message.overlayId ? message.overlayId : defaultLayerId,
                zoom: null //defaulting auto zoom to null since we dont support zooming into a certain range
            });
		},



        mapViewCenterFeature: function(message) {
            console.log('vcf');
         //   mediator.zoomToMaxExtent();
                mediator.zoomToFeatures({
                    layerId: message.overlayId ? message.overlayId : defaultLayerId,
                   featureIds: message.featureId ? message.featureId : 'f1'
                });

        },

        //
        //mapViewCenterFeature: function(message) {
        //    console.log("cmapi-view vcf");
        //    console.debug(mediator);
        //    //console.log("Zumba, ", mediator.zoomToLayer());
        //    //console.log("Dumba, ", mediator.zoomToLayer);
        //    console.debug(message);
        //    //mediator.zoomToLayer({
        //    //    layerId: message.overlayId ? message.overlayId : defaultLayerId,
        //    //    zoom: null //defaulting auto zoom to null since we dont support zooming into a certain range
        //    //});
        //    mediator.zoomToFeatures({
        //        layerId: message.overlayId ? message.overlayId : defaultLayerId,
        //       featureIds: message.featureId ? message.featureId : 'f1'
        //    });
        //    console.debug(context.sandbox);
        //
        //    mediator.setCenter({
        //       lon: -20,
        //        lat: -20
        //    });
        //},



            //mapViewCenterFeature: function(message) {
         //   //check for required fields (featureId)
         //   if(message !== undefined && message !== '' && !('featureId' in message)) {
         //       sendError('map.view.center.feature', message, 'message must include a featureId');
         //       return;
         //   }
        //
         //   try{
         //       context.sandbox.dataStorage.getFeatureById(message, function(data) {
         //           var extent;
         //           //If the feature is a point, set center; else, zoom to extent
         //           if(data.geometry){
         //               if(data.geometry.type === 'Point') {
         //                   mediator.setCenter({
         //                       lon: data.geometry.coordinates[1],
         //                       lat: data.geometry.coordinates[0]
         //                   });
         //               } else { //if feature is any other geometry
         //                   extent = context.sandbox.cmapi.getMaxExtent(data.geometry.coordinates);
         //                   mediator.centerOnBounds(extent);
         //               }
         //           } else {
         //               context.sandbox.external.postMessageToParent({
         //                   channel: 'map.view.center.feature',
         //                   message: 'message failure - feature not found'
         //               });
         //           }
         //        });
         //   } catch (error){
         //       context.sandbox.external.postMessageToParent({
         //           channel: 'map.view.center.feature',
         //           message: 'message failure - feature not found'
         //       });
         //   }
		//},
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