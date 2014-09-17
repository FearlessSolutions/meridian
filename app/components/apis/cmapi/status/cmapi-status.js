/**
 * Handles all of the CMAPI status channels
 * TODO needs to actually be implemented
 */
define([
	'./cmapi-status-publisher',	
	'./cmapi-status-subscriber'
], function (publisher, subscriber) {
	var context,
        sendError,
        emit;

    var exposed = {
        init: function(thisContext, errorChannel, parentEmit) {
            context = thisContext;
            sendError = errorChannel;
            emit = parentEmit;
            publisher.init(context);
            subscriber.init(context, exposed);

            //On map.status.ready, send message
            context.sandbox.stateManager.triggerMapStatusReady(emitChannels['map.status.ready']);
        },
        receive: function(channel, message) {
            if(receiveChannels[channel]) {
                receiveChannels[channel](message);
            } else {
                sendError(channel, message, 'Channel not supported');
            }
        },
        emit: function(channel, message) {
            emit(channel, message);
        },
        emitViewStatus: function(params) {
            // TODO: get status from State Manager
            // var message = {
            //     bounds:{
            //         southWest:{
            //             lat: params.bottom,
            //             lon: params.left
            //         },
            //         northEast:{
            //             lat: params.top,
            //             lon: params.right
            //         }
            //     },
            //     center: params.center,
            //     range: 0 //meters
            // };
            // emit('map.status.view', message);
        }
    };

    var receiveChannels= {
		"map.status.request": function(message) {
            if(message.types) {
                message.types.forEach(function(channel) {
                    if(emitChannels['map.status.' + channel]) {
                        emitChannels['map.status.' + channel]();
                    }
                });   
            } else {
                //If no types, do all of them
                for(var channel in emitChannels) {
                    emitChannels[channel]();
                }
            }			
		}	
    };

    var emitChannels= {
        "map.status.view": function() {
            // TODO: read map statuse values from the State Manager, and format to CMAPI bounds
            // context.sandbox.stateManager.getMapExtent()
            // emit('map.status.view', message);
        },
        "map.status.format": function() {
            var message = {
                formats: ['geojson']
            };
            emit('map.status.format', message);
        },
        "map.status.about": function() {
           var message = {
               "version": "2.0",
               "type": "2-D",
               "widgetName": context.sandbox.systemConfiguration.appName,
               "extensions": []
           };
           emit('map.status.about', message);
        },
        "map.status.selected": function() {
           // var message = {
           //     overlayId: '',
           //     selectedFeatures: []
           // };
           // emit('map.status.selected', message);
        },
        "map.status.ready": function() {
            var message = {
                "widgetName": context.sandbox.systemConfiguration.appName,
                "readyState": true
            };
            emit('map.status.ready', message);
         }
    };

    return exposed;

});