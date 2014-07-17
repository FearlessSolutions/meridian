define([
	'./cmapi-feature-publisher',	
	'./cmapi-feature-subscriber'
], function (publisher, subscriber) {
	var context,
		defaultLayerId,
        sendError,
        emit;

    var receiveChannels= {
		"map.feature.plot": function(message){
            if(message === ''){
                return;
            }else if(!message.format || message.format === 'geojson'){
                plotGeoJSON(message);
            }else if(message.format === 'kml'){
                sendError('map.feature.unplot', message, 'KML is not currently supported');
            }else{
                sendError('map.feature.unplot', message, 'Must be in geoJSON format');
            }
		},
		"map.feature.plot.url": function(message){
            sendError('map.feature.plot.url', message, 'Channel not supported');
		},
		"map.feature.unplot": function(message){
            sendError('map.feature.unplot', message, 'Channel not supported');
		},
		"map.feature.hide": function(message){
            sendError('map.feature.hide', message, 'Channel not supported');
		},
		"map.feature.show": function(message){
            sendError('map.feature.show', message, 'Channel not supported');
		},
		"map.feature.selected": function(message){
            sendError('map.feature.selected', message, 'Channel not supported');
		},
		"map.feature.deselected": function(message){
            sendError('map.feature.deselected', message, 'Channel not supported');
		},
		"map.feature.update": function(message){
            sendError('map.feature.update', message, 'Channel not supported');
		}
    };

	var exposed = {
		init: function(thisContext, layerId, errorChannel) {
			context = thisContext;
			defaultLayerId = layerId;
            sendError = errorChannel;
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
        }
	};

    function plotGeoJSON(message){
        var postOptions,
            layerId;

        if(!message.feature ||
            !message.feature ||
            !Array.isArray(message.feature.features) ||
            message.feature.features.length === 0){
            return false;
        }
        layerId = message.overlayId || defaultLayerId;

        if(!context.sandbox.dataStorage.datasets[layerId]) {
            context.sandbox.dataStorage.datasets[layerId] = new Backbone.Collection();
            publisher.publishCreateLayer({
                "layerId": layerId,
                "name": message.name || "",
                "selectable": message.selectable || true // Default true
            });
        }

        postOptions = {
            "type": "POST",
            "url": context.sandbox.utils.getCurrentNodeJSEndpoint() + "/feature",
            "data": {
                "queryId": layerId,
                "data": message.feature.features
            },
            "xhrFields": {
                "withCredentials": true
            }
        };

        var newAJAX = context.sandbox.utils.ajax(postOptions)
            .done(function(data){
                var newData = [];
                if(data){

                    message.feature.features.forEach(function(feature, index){
                        var newValue = {};

                        newValue.dataService = "cmapi";
                        newValue.id = data.items[index].index._id; //TODO this should change serverside
                        newValue.geometry = feature.geometry;
                        newValue.type = feature.type;
                        newValue.properties = feature.properties;

                        context.sandbox.dataStorage.addData({
                            "datasetId": layerId,
                            "data": newValue
                        });

                        newData.push(newValue);
                    });

                    publisher.publishPlotFeature({
                        "layerId": layerId,
                        "data": newData
                    });

                    publisher.publishPlotFinish({"layerId": layerId});
                } else {
                    publisher.publishPlotError({"layerId": layerId});
                    sendError('map.feature.plot', message, 'No data plotted');

                }

            }).error(function(){
                publisher.publishPlotError({"layerId": layerId});
                sendError('map.feature.plot', message, 'Server not available or malformed geoJSON');

            });

        context.sandbox.ajax.addActiveAJAX(newAJAX, layerId);

        //TODO collection-wide style map?
        //TODO modify format more?

    }

    return exposed;
});