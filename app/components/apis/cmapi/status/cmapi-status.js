/**
 * Handles all of the CMAPI status channels
 * TODO needs to actually be implemented
 */
define([
	'./cmapi-status-publisher',	
	'./cmapi-status-subscriber'
], function (publisher, subscriber) {
	var context,
        emit;

    var receiveChannels= {
		"map.status.request": function(message){
            if(message.types){
                message.types.forEach(function(channel){
                    if(emitChannels['map.status.' + channel]){
                        emitChannels['map.status.' + channel]();
                    }
                });   
            }else{
                //If no types, do all of them
                for(var channel in emitChannels){
                    emitChannels[channel]();
                }
            }			
		}	
    };

    var emitChannels= {
        "map.status.view": function(){
//            publisher.getStatus(); //Will call exposed.emitViewStatus when replied to
        },
        "map.status.format": function(){
            var message = {
                formats: ['geojson']
            };
            emit('map.status.format', message);
        },
        "map.status.about": function(){
//            var message = {
//                "version": "2.0",
//                "type": "map",
//                "widgetName": "Meridian-Geo",
//                "extensions": []
//            };
//            emit('map.status.about', message);
        },
        "map.status.selected": function(){
//            var message = {
//                overlayId: '',
//                selectedFeatures: []
//            };
//            emit('map.status.selected', message);
        }
    };

	var exposed = {
		init: function(thisContext, layerId, parentEmit) {
			context = thisContext;
            emit = parentEmit;
            publisher.init(context);
            subscriber.init(context, exposed);
        },
        receive: function(channel, message){
        	if(receiveChannels[channel]){
        		receiveChannels[channel](message);
        	}else{
        		//error?
        	}
        },
        emit: function(channel, message){
            emit(channel, message);
        },
        emitViewStatus: function(params){
//            var message = {
//                bounds:{
//                    southWest:{
//                        lat: params.bottom,
//                        lon: params.left
//                    },
//                    northEast:{
//                        lat: params.top,
//                        lon: params.right
//                    }
//                },
//                center: params.center,
//                range: 0 //meters
//            };
//            emit('map.status.view', message);
        }
	};

    return exposed;


});