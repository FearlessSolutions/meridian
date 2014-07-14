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

    var emitChannels= {
        "map.feature.plot": function(message){
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
		init: function(thisContext, layerId, parentEmit) {
			context = thisContext;
			defaultLayerId = layerId;
            emit = parentEmit;
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

    /*
     publisher.createLayer({
     "layerId": params.queryId,
     "name": params.name,
     "selectable": true,
     "coords": {
     "minLat": params.minLat,
     "minLon": params.minLon,
     "maxLat": params.maxLat,
     "maxLon": params.maxLon
     }
     });
     */


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

                cleanAJAX();

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
                //TODO error
            });

        activeAJAXs.push(newAJAX);


        /*

        //TODO collection-wide style map?
        //TODO modify format more?
        message.layerId = message.overlayId || defaultLayerId;
        message.name = message.name || '';
        if(message.overlayId ){
            message.feature.overlayId = message.overlayId || defaultLayerId;
            message.feature.name = message.name;
            message.feature.zoom = message.zoom;
            message.feature.format = message.format;
            message = message.feature;
        }

        message.overlayId = message.overlayId || message.origin || defaultLayerId;

        if(!context.sandbox.dataStorage.datasets[message.overlayId]) {
            context.sandbox.dataStorage.datasets[message.overlayId] = new Backbone.Collection();
        }

        else if(!message.format || message.format === 'geojson'){
            //Add to and adjust properties; Add to dataset
            message.features.forEach(function(feature){
                if(feature.properties
                    && feature.properties.style
                    && feature.properties.style.iconStyle
                    && feature.properties.style.iconStyle.url){
                    feature.properties.icon = feature.properties.style.iconStyle.url;
                    feature.properties.height = 25;
                    feature.properties.width = 25;
                }else{
                    var icon = context.sandbox.mapConfiguration.markerIcons.default;

                    feature.properties.icon = icon.icon; //We only use icons, so clean up everything
                    feature.properties.height = icon.height;
                    feature.properties.width = icon.width;
                }

                var newValue = {};
                feature.properties.dataService = 'cmapi';
                context.sandbox.utils.each(feature.properties, function(k, v){
                    newValue[k] = v;
                });
                newValue.id = feature.properties.featureId || feature.id;

                context.sandbox.dataStorage.datasets[message.overlayId].add(newValue);
            });
        }else {
        }

        publisher.publishPlotFeature(message);
        */
    }

    function stopAllAJAX(){
        activeAJAXs.forEach(function(ajax){
            ajax.abort();
        });

        activeAJAXs = [];
    }

    /**
     * Stop a query's ajax call,
     * This function requires that ajax.queryId was set when the query was created.
     */
    function abortQuery(params){
        activeAJAXs.forEach(function(ajax, index){
            if(ajax.queryId === params.queryId){ //This was set in queryData
                ajax.abort();
                activeAJAXs.splice(index, 1);
            }
        });
    }

    /**
     * Clean up all finished ajax calls from the activeAJAXs array
     */
    function cleanAJAX(){
        activeAJAXs.forEach(function(ajax, index){
            if(ajax.readyState === 4){ //4 is "complete" status
                activeAJAXs.splice(index, 1);
            }
        });
    }

    return exposed;
});