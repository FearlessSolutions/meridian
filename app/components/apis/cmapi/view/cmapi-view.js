define([
	'./cmapi-view-publisher'
], function (publisher) {
	var context;

    var receiveChannels= {
		"map.view.zoom": function(message){ //TODO verify this is correct
			if('range' in message){
				publisher.publishZoom(message);
			}else if('direction' in message){ //TODO should we support this?
                if(message.direction === 'in'){
                    //TODO
                }else if(message.direction === 'out'){
                    //TODO
                }
			}else{
                //error
            }
		},
		"map.view.center.overlay": function(message){
            //TODO
		},
		"map.view.center.feature": function(message){
            //TODO
		},
		"map.view.center.location": function(message){ //TODO make sure this is still valid
			if('location' in message 
				&& 'lat' in message.location
				&& 'lon' in message.location){
				publisher.publishZoom(message.location);
			}else{
				//Error
			}
		},
		"map.view.center.bounds": function(message){
            var bounds;

            if(!message.bounds ||
                !message.bounds.northEast || !('lat' in message.bounds.northEast) || !('lon' in message.bounds.northEast) ||
                !message.bounds.southWest || !('lat' in message.bounds.southWest) || !('lon' in message.bounds.southWest)){
                //TODO error
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
		"map.view.clicked": function(message){
            //This is not supported
            //TODO remove this?
		}	
    };

	var exposed = {
		init: function(thisContext) {
			context = thisContext;
            publisher.init(context);
        },
        receive: function(channel, message){
        	if(receiveChannels[channel]){
        		receiveChannels[channel](message);
        	}else{
        		//error?
        	}
        }
	};

    return exposed;
});