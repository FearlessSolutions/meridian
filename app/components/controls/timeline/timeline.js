define([
    './timeline-publisher',
    'text!./snapshot.hbs',
    './snapshot-menu',
    'bootstrap',
    'handlebars'
], function (publisher, snapshotHBS, snapshotMenu) {
    var context,
        snapshotTemplate,
        $timeline,
        stopTimelinePlayback = true;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            snapshotMenu.init(context);
            snapshotTemplate = Handlebars.compile(snapshotHBS);
            $timeline = context.$('#timeline');
        },
        createSnapshot: function(args){
            var queryId = args.queryId,
                name = args.name,
                coords = args.coords,
                thumnailURL;

            if(context.sandbox.dataStorage.datasets[args.queryId]) {

                if(coords) {

                    thumnailURL = context.sandbox.snapshot.thumbnailURL(coords);

                    publisher.createLayer({
                        "queryId": queryId + "_aoi",
                        "name": name + "_aoi",
                        "initialVisibility": true,
                        "styleMap": {
                            "default": {
                                "strokeColor": '#000',
                                "strokeOpacity": 0.3,
                                "strokeWidth": 2,
                                "fillColor": 'gray',
                                "fillOpacity": 0.3
                            }
                        }
                    });
                        
                    publisher.setLayerIndex({
                        "layerId": queryId + "_aoi",
                        "layerIndex": 0
                    });

                    publisher.plotFeatures({
                        "layerId": queryId + "_aoi",
                        "data": [{
                            "queryId": queryId + "_aoi",
                            "featureId": "_aoi",
                            "dataService": "",
                            "id": "_aoi",
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [[
                                    [coords.minLon, coords.maxLat],
                                    [coords.maxLon, coords.maxLat],
                                    [coords.maxLon, coords.minLat],
                                    [coords.minLon, coords.minLat]
                                ]]
                            },
                            "type": "Feature"
                        }]
                    });

                } else {
                    // TODO: Change thumbnail to stock placeholder
                    thumnailURL = context.sandbox.snapshot.thumbnailURL({
                        "minLat": -10,
                        "minLon": -10,
                        "maxLat": 10,
                        "maxLon": 10
                    });

                }

                var	snapshotHTML = snapshotTemplate({
                    "queryId": queryId,
                    "name": name,
                    "thumbnailURL": thumnailURL
                });

                context.$('#timeline-container').append(snapshotHTML);
                $timeline.show();
                $timeline.scrollLeft(5000);
                $timeline.fadeIn();

                snapshotMenu.createMenu({'queryId': queryId});

                context.$('#snapshot-' + queryId).find('.btn-toggle').on('click', function() {
                    var collection = context.sandbox.dataStorage.datasets[queryId],
                        $this = context.$(this),
                        $thisBtns = $this.find('.btn');


                    if ($this.find('.btn-primary').size()>0) {
                        $thisBtns.toggleClass('btn-primary');
                    }

                    /** These Lines can probably be removed. Eric/Steve say they need to be here,
                        so I will leave them, but I didn't see any problems when I removed them**/
                    if ($this.find('.btn-danger').size()>0) {
                        $thisBtns.toggleClass('btn-danger');
                    }
                    if ($this.find('.btn-success').size()>0) {
                        $thisBtns.toggleClass('btn-success');
                    }
                    if ($this.find('.btn-info').size()>0) {
                        $thisBtns.toggleClass('btn-info');
                    }
                    /** End remove lines **/


                    if($this.find('.btn-on').hasClass('btn-primary')) {
                        context.sandbox.stateManager.layers[queryId].visible = true;
                        publisher.showLayer({"layerId": queryId});
                        publisher.showLayer({"layerId": queryId + '_aoi'});
                    } else {
                        context.sandbox.stateManager.layers[queryId].visible = false;
                        publisher.hideLayer({"layerId": queryId});
                        publisher.hideLayer({"layerId": queryId + '_aoi'});
                    }
                });
                
                exposed.setTooltip(queryId, 'Starting', 0);

            }
        },
        /*A message to hide all layers was emitted. Toggles buttons to the off position.*/
        allSnapshotsOff: function(args){
            //this will iterate through every backbone collection. Each collection is a query layer with the key being the queryId.
            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(queryId, collections){
                var $querySnapshot = context.$('#snapshot-' + queryId);
                if($querySnapshot.find('.btn-primary').size()>0){
                    //only toggle class if ON button is active.
                    if($querySnapshot.find('.active').hasClass('btn-primary')){
                        $querySnapshot.find('.btn').toggleClass('btn-primary'); //Two buttons
                    }
                }
            });
        },
        layerToggleOn: function(args){
            var $querySnapshot = context.$('#snapshot-' + args.layerId);
            $querySnapshot.find('.btn-on').addClass('btn-primary');
            $querySnapshot.find('.btn-off').removeClass('btn-primary');
        },
        layerToggleOff: function(args){
            var $querySnapshot = context.$('#snapshot-' + args.layerId);
            $querySnapshot.find('.btn-on').removeClass('btn-primary');
            $querySnapshot.find('.btn-off').addClass('btn-primary');
        },
        hideTimeline: function(args){
            $timeline.hide();
        },
        showTimeline: function(args){
			$timeline.show();	
		},
		clear: function(){
			context.$('#timeline-container').html('');
            $timeline.hide();
		},
        addCount: function(args){
            var $badge = context.$('#snapshot-' + args.queryId + ' .badge'),
                count = $badge.data('count') || 0;

            count += args.data.length;
            $badge.text(context.sandbox.utils.trimNumber(count));
            $badge.data('count', count);
            exposed.setTooltip(args.queryId,'Running', count);
        },
        markFinished: function(args){
            var $badge = context.$('#snapshot-' + args.queryId + ' .badge');
            $badge.addClass('finished');
            exposed.setTooltip(args.queryId,'Finished', $badge.data('count'));
        },
        markError: function(args){
            var $badge = context.$('#snapshot-' + args.queryId + ' .badge'),
                count = $badge.data('count') || 0;

            $badge.addClass('error');
            exposed.setTooltip(args.queryId, 'Error', count);
        },
        setTooltip: function(queryId, status, recordCount){
            var $owner = context.$('#snapshot-' + queryId),
                name = $owner.attr('data-title');

            //must destroy to add and modify tooltip
            $owner.tooltip('destroy'); 
            //add new tooltip
            $owner.tooltip({
                "html": true,
                "title": 'Name: ' + name + '<br/>' +
                    'Status: '+ status + '<br/>' +
                    'Features: ' + recordCount
            });
        },
        timelinePlaybackStart: function(args){
            if(checkLayerCount() > 1) {
                stopTimelinePlayback = false;

                var tempArray = [];
                context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(queryId, collections){
                    tempArray.push(queryId);
                    context.sandbox.stateManager.layers[queryId].visible = false;
                    exposed.hideLayer({
                        "layerId": queryId
                    });
                });

                // publisher.hideAllLayers();
                
                exposed.allSnapshotsOff();
                exposed.showLayer({
                    "layerId": tempArray[0]
                });
                var $querySnapshot = context.$('#snapshot-' + tempArray[0]);
                $querySnapshot.addClass('selected');

                $timeline.animate({scrollLeft: 0});

                var i = 1;
                var timer = setInterval(function() {
                    if(!stopTimelinePlayback && context.sandbox.dataStorage.datasets[tempArray[i]]) {
                        if(i > 3){
                            var leftPos = $timeline.scrollLeft();
                            //console.log(context.$('#snapshot-' + tempArray[i).width);
                            $timeline.animate({scrollLeft: leftPos + 120});
                        }

                        exposed.hideLayer({
                            "layerId": tempArray[i-1]
                        });
                        var $querySnapshotOld = context.$('#snapshot-' + tempArray[i-1]);
                        $querySnapshotOld.removeClass('selected');

                        exposed.showLayer({
                            "layerId": tempArray[i]
                        });
                        var $querySnapshotNew = context.$('#snapshot-' + tempArray[i]);
                        $querySnapshotNew.addClass('selected');

                        i++;
                    } else {
                        if(!context.sandbox.dataStorage.datasets[tempArray[i]]) {
                            publisher.stopPlayback({"status": "Finished"});
                        }
                        clearInterval(timer);
                        context.$('#snapshot-' + tempArray[i-1]).removeClass('selected');
                    }
                }, 4000);
            }
        },
        timelinePlaybackStop: function(args) {
            stopTimelinePlayback = true;
            context.$('.snapshot').removeClass('selected');
        },
        showLayer: function(params) {
            context.sandbox.stateManager.layers[params.layerId].visible = true;
            publisher.showLayer({"layerId": params.layerId});
            context.sandbox.stateManager.layers[params.layerId + '_aoi'].visible = true;
            publisher.showLayer({"layerId": params.layerId + '_aoi'});
            var $querySnapshot = context.$('#snapshot-' + params.layerId);
            if($querySnapshot.find('.btn-primary').size()>0){
                //only toggle class if ON button is active.
                if(!$querySnapshot.find('.active').hasClass('btn-primary')){
                    $querySnapshot.find('.btn').toggleClass('btn-primary'); //Two buttons
                }
            }
        },
        hideLayer: function(params) {
            context.sandbox.stateManager.layers[params.layerId].visible = false;
            publisher.hideLayer({"layerId": params.layerId});
            context.sandbox.stateManager.layers[params.layerId + '_aoi'].visible = false;
            publisher.hideLayer({"layerId": params.layerId + '_aoi'});
            var $querySnapshot = context.$('#snapshot-' + params.layerId);
            if($querySnapshot.find('.btn-primary').size()>0){
                //only toggle class if ON button is active.
                if($querySnapshot.find('.active').hasClass('btn-primary')){
                    $querySnapshot.find('.btn').toggleClass('btn-primary'); //Two buttons
                }
            }
        }
    };

    function checkLayerCount() {
        if(context.sandbox.stateManager.layers) {
            return _.size(context.sandbox.stateManager.layers);
        } else {
            return 0;
        }
    }

    return exposed;
});