define([
	'./cmapi-feature-publisher',	
	'./cmapi-feature-subscriber'
], function (publisher, subscriber) {
	var context,
		defaultLayerId,
        emit,
        activeAJAXs;

    var receiveChannels= {
		"map.feature.plot": function(message){
            if(message === ''){
                return;
            }else if(!message.format || message.format === 'geojson'){
                plotGeoJSON(message);
            }else if(message.format === 'kml'){
                //TODO error for now
            }else{
                //TODO error
            }
		},
		"map.feature.plot.url": function(message){
			//TODO don't support?
		},
		"map.feature.unplot": function(message){
			//TODO no remove feature yet
		},
		"map.feature.hide": function(message){
			//TODO no hide single feature yet
		},
		"map.feature.show": function(message){
			//TODO no show single feature yet
		},
		"map.feature.selected": function(message){
			//TODO no selection yet
		},
		"map.feature.deselected": function(message){
			//TODO no deselection yet
		},
		"map.feature.update": function(message){
			//TODO don't support?
		}
    };

	var exposed = {
		init: function(thisContext, layerId) {
			context = thisContext;
			defaultLayerId = layerId;
            activeAJAXs = [];
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
                // TODO add coords prop
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

        //TODO save to server //TODO keep track of AJAX
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

                    //TODO finish messaging
                }

            }).error(function(){
                publisher.publishPlotError({"layerId": layerId});

                //TODO error
            });

        context.sandbox.ajax.addActiveAJAX(newAJAX, layerId);

        //TODO collection-wide style map?
        //TODO modify format more?

    }

    return exposed;
});