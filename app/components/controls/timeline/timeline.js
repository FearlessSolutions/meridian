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
                thumnailURL = context.sandbox.snapshot.thumbnailURL(coords);

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
                } else {
                    context.sandbox.stateManager.layers[queryId].visible = false;
                    publisher.hideLayer({"layerId": queryId});
                }
            });
            
            exposed.setTooltip(queryId, 'Starting', 0);
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
                context.sandbox.utils.each(context.sandbox.stateManager.layers, function(key, value){
                    if(value.visible) {
                        console.log(key);
                    }
                });


                stopTimelinePlayback = false;

                var tempArray = [];
                context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(queryId, collections){
                    tempArray.push(queryId);
                    context.sandbox.stateManager.layers[queryId].visible = false;
                });


                publisher.hideAllLayers();
                exposed.allSnapshotsOff();
                exposed.showLayer(tempArray[0]);
                $timeline.animate({scrollLeft: 0});

                var i = 1;
                var timer = setInterval(function() {
                    if(!stopTimelinePlayback && context.sandbox.dataStorage.datasets[tempArray[i]]) {
                        if(i > 3){
                            var leftPos = $timeline.scrollLeft();
                            //console.log(context.$('#snapshot-' + tempArray[i).width);
                            $timeline.animate({scrollLeft: leftPos + 120});
                        }
                        exposed.hideLayer(tempArray[i-1]);
                        exposed.showLayer(tempArray[i]);
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
        showLayer: function(queryId){
            context.sandbox.stateManager.layers[queryId].visible = true;
            publisher.showLayer({"layerId": queryId});
            var $querySnapshot = context.$('#snapshot-' + queryId);
            $querySnapshot.addClass('selected');
            if($querySnapshot.find('.btn-primary').size()>0){
                //only toggle class if ON button is active.
                if(!$querySnapshot.find('.active').hasClass('btn-primary')){
                    $querySnapshot.find('.btn').toggleClass('btn-primary'); //Two buttons
                }
            }
        },
        hideLayer: function(queryId){
            context.sandbox.stateManager.layers[queryId].visible = false;
            publisher.hideLayer({"layerId": queryId});
            var $querySnapshot = context.$('#snapshot-' + queryId);
            $querySnapshot.removeClass('selected');
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