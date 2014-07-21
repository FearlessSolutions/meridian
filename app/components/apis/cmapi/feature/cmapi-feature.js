define([
	'./cmapi-feature-publisher',	
	'./cmapi-feature-subscriber'
], function (publisher, subscriber) {
	var context,
		defaultLayerId,
        sendError,
        emit;

    //Map channels to functions, and error if a channel is not supported
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

    /**
     * Plot passed in geoJSON
     * If geoJSON is trying to be put in a layer that doesn't exist
     * @param message
     * message =
     * {
        "overlayId":"STRING",           (optional)(default: 'cmapi'
        "format":"geojson",             (required)
        "feature":{                     (required)
            "type":"FeatureCollection"  (required),
            "features":[ (required) (this must be formatted as proper geoJSON features)
                {
                    "type":"Feature",
                    "geometry":{
                        "type":"Polygon",
                         "coordinates": [*]
                    },
                    "properties":{
                        "p1": "test prop 1"
                    }
                }
            ]
        },
        "name":"STRING",                (optional)(default: '')
        "zoom":"true",                  (optional)(default: true)(If it should center and zoom after plotting)
        "selectable":BOOLEAN            (optional)(default: true)
    }
     *Note that name and selectable will only be used if there was no overlay with the given id
     */
    function plotGeoJSON(message){
        var postOptions,
            layerId,
            layerOptions;

        if(!message.feature ||
            !message.feature ||
            !Array.isArray(message.feature.features) ||
            message.feature.features.length === 0){
            return false;
        }
        layerId = message.overlayId || defaultLayerId;

        if(!context.sandbox.dataStorage.datasets[layerId]) {
            context.sandbox.dataStorage.datasets[layerId] = new Backbone.Collection();
            layerOptions = {
                "layerId": layerId,
                "name": message.name || ""
            };

            ('selectable' in message) ?
                layerOptions.selectable = message.selectable :
                true; //Default to true

            publisher.publishCreateLayer(layerOptions);
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

        // Save the features and plot them.
        var newAJAX = context.sandbox.utils.ajax(postOptions)
            .done(function(data){
                var newData = [];
                if(data){

                    message.feature.features.forEach(function(feature, index){
                        var newValue = {};

                        newValue.dataService = 'cmapi';
                        newValue.id = data.items[index].index._id; //TODO this should change serverside
                        newValue.geometry = feature.geometry;
                        newValue.type = feature.type;
                        newValue.properties = feature.properties;
                        if(feature.geometry.type === 'Point'){
                            newValue.lat = feature.geometry.coordinates[1];
                            newValue.lon = feature.geometry.coordinates[0];
                        }

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