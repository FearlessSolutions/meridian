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
            var layerId = args.layerId,
                name = args.name,
                coords = args.coords,
                thumnailURL;

            if(context.sandbox.dataStorage.datasets[args.layerId]) {

                if(coords) {

                    thumnailURL = context.sandbox.snapshot.thumbnailURL(coords);

                    publisher.createLayer({
                        "layerId": layerId + "_aoi",
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
                        "layerId": layerId + "_aoi",
                        "layerIndex": 0
                    });

                    publisher.plotFeatures({
                        "layerId": layerId + "_aoi",
                        "data": [{
                            "layerId": layerId + "_aoi",
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
                    thumnailURL = context.sandbox.snapshot.thumbnailURL();
                }

                var	snapshotHTML = snapshotTemplate({
                    "layerId": layerId,
                    "name": name,
                    "thumbnailURL": thumnailURL
                });

                context.$('#timeline-container').append(snapshotHTML);
                $timeline.show();
                $timeline.scrollLeft(5000);
                $timeline.fadeIn();

                snapshotMenu.createMenu({'layerId': layerId});

                context.$('#snapshot-' + layerId).find('.btn-toggle').on('click', function() {
                    var collection = context.sandbox.dataStorage.datasets[layerId],
                        $this = context.$(this),
                        $thisBtns = $this.find('.btn');

                    if ($this.find('.btn-primary').size()>0) {
                        $thisBtns.toggleClass('btn-primary');
                    }

                    if($this.find('.btn-on').hasClass('btn-primary')) {
                        // Does not call showLayer to avoid duplicate effort to toggleBtn change
                        exposed.showDataLayer({
                            "layerId": layerId
                        });
                        exposed.showAOILayer({
                            "layerId": layerId
                        });
                    } else {
                        exposed.hideDataLayer({
                            "layerId": layerId
                        });
                        exposed.hideAOILayer({
                            "layerId": layerId
                        });
                    }
                });
                
                exposed.setTooltip(layerId, 'Starting', 0);

            }
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
            var $badge = context.$('#snapshot-' + args.layerId + ' .badge'),
                count = $badge.data('count') || 0;

            count += args.data.length;
            $badge.text(context.sandbox.utils.trimNumber(count));
            $badge.data('count', count);
            exposed.setTooltip(args.layerId,'Running', count);
        },
        markFinished: function(args){
            var $badge = context.$('#snapshot-' + args.layerId + ' .badge');
            if(!$badge.hasClass("error")){
                $badge.addClass('finished');
                exposed.setTooltip(args.layerId,'Finished', $badge.data('count'));
                snapshotMenu.disableOption(args.layerId, 'stopQuery');
            }
        },
        markStopped: function(args){
            var $badge = context.$('#snapshot-' + args.layerId + ' .badge'),
                count = $badge.data('count') || 0;
            if(!$badge.hasClass('error') && !$badge.hasClass('finished')){
                $badge.addClass('stopped');
                exposed.setTooltip(args.layerId, 'Stopped', count);
                snapshotMenu.disableOption(args.layerId, 'stopQuery');
            }
        },
        markError: function(args){
            var $badge = context.$('#snapshot-' + args.layerId + ' .badge'),
                count = $badge.data('count') || 0;

            $badge.addClass('error');
            exposed.setTooltip(args.layerId, 'Error', count);
            snapshotMenu.disableOption(args.layerId, 'stopQuery');
        },
        setTooltip: function(layerId, status, recordCount){
            var $owner = context.$('#snapshot-' + layerId),
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
                context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(layerId, collections){
                    tempArray.push(layerId);
                    context.sandbox.stateManager.layers[layerId].visible = false;
                    exposed.hideSnapshotLayerGroup({
                        "layerId": layerId
                    });
                });
                
                exposed.showSnapshotLayerGroup({
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

                        exposed.hideSnapshotLayerGroup({
                            "layerId": tempArray[i-1]
                        });
                        var $querySnapshotOld = context.$('#snapshot-' + tempArray[i-1]);
                        $querySnapshotOld.removeClass('selected');

                        exposed.showSnapshotLayerGroup({
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
            if(context.sandbox.dataStorage.datasets[params.layerId]) {
                // Take care of AOI and toggleBtn state
                exposed.showAOILayer({
                    "layerId": params.layerId
                });
                exposed.layerToggleOn({
                    "layerId": params.layerId
                });
            }
        },
        hideLayer: function(params) {
            if(context.sandbox.dataStorage.datasets[params.layerId]) {
                // Take care of AOI and toggleBtn state
                exposed.hideAOILayer({
                    "layerId": params.layerId
                });
                exposed.layerToggleOff({
                    "layerId": params.layerId
                });
            }
        },
        showSnapshotLayerGroup: function(params) {
            exposed.showDataLayer({
                "layerId": params.layerId
            });
            exposed.showAOILayer({
                "layerId": params.layerId
            });
            exposed.layerToggleOn({
                "layerId": params.layerId
            });
        },
        hideSnapshotLayerGroup: function(params) {
            exposed.hideDataLayer({
                "layerId": params.layerId
            });
            exposed.hideAOILayer({
                "layerId": params.layerId
            });
            exposed.layerToggleOff({
                "layerId": params.layerId
            });
        },
        showDataLayer: function(params) {
            context.sandbox.stateManager.layers[params.layerId].visible = true;
            publisher.showLayer({"layerId": params.layerId});
        },
        hideDataLayer: function(params) {
            context.sandbox.stateManager.layers[params.layerId].visible = false;
            publisher.hideLayer({"layerId": params.layerId});
        },
        showAOILayer: function(params) {
            context.sandbox.stateManager.layers[params.layerId + '_aoi'].visible = true;
            publisher.showLayer({"layerId": params.layerId + '_aoi'});
        },
        hideAOILayer: function(params) {
            context.sandbox.stateManager.layers[params.layerId + '_aoi'].visible = false;
            publisher.hideLayer({"layerId": params.layerId + '_aoi'});
        },
        layerToggleOn: function(params){
            var $querySnapshot = context.$('#snapshot-' + params.layerId);
            $querySnapshot.find('.btn-on').addClass('btn-primary');
            $querySnapshot.find('.btn-off').removeClass('btn-primary');
        },
        layerToggleOff: function(params){
            var $querySnapshot = context.$('#snapshot-' + params.layerId);
            $querySnapshot.find('.btn-on').removeClass('btn-primary');
            $querySnapshot.find('.btn-off').addClass('btn-primary');
        },
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