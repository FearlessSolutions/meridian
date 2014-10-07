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
        stopTimelinePlayback = true,
        timer;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            snapshotMenu.init(context);
            snapshotTemplate = Handlebars.compile(snapshotHBS);
            $timeline = context.$('#timeline');
        },
        createSnapshot: function(params) {
            var layerId = params.layerId,
                name = params.name,
                coords = params.coords,
                thumnailURL;

            if(context.sandbox.dataStorage.datasets[params.layerId]) {

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
                    "thumbnailURL": thumnailURL,
                    "count": context.sandbox.dataStorage.datasets[params.layerId].length || 0
                });

                context.$('#timeline-container').append(snapshotHTML);
                exposed.showTimeline();
                publisher.openTimeline();

                snapshotMenu.createMenu({'layerId': layerId});

                context.$('#snapshot-' + layerId).find('.btn-toggle').on('click', function() {
                    var collection = context.sandbox.dataStorage.datasets[layerId],
                        $this = context.$(this),
                        $thisBtns = $this.find('.btn');

                    if($this.find('.btn-primary').size()>0) {
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
                
                // Build custom tooltip to hold dynamic information
                exposed.setTooltip({
                    "layerId": layerId,
                    "status": "Starting"
                });

            }
        },
        hideTimeline: function(params) {
            $timeline.hide();
        },
        showTimeline: function(params) {
			$timeline.show();
            $timeline.scrollLeft(5000);
		},
		clear: function() {
			context.$('#timeline-container').html('');
            $timeline.hide();
            publisher.closeTimeline();
		},
        updateCount: function(params) {
            if(context.sandbox.dataStorage.datasets[params.layerId]) {
                var $badge = context.$('#snapshot-' + params.layerId + ' .badge'),
                    count = context.sandbox.dataStorage.datasets[params.layerId].length || 0;
                if($badge.length > 0) {
                    $badge.text(context.sandbox.utils.trimNumber(count));
                    exposed.updateTooltip({
                        "layerId": params.layerId,
                        "status": "Running"
                    });
                }
            }
        },
        markFinished: function(params) {
            var $badge = context.$('#snapshot-' + params.layerId + ' .badge');
            if(!$badge.hasClass("error")) {
                $badge.addClass('finished');
                exposed.updateTooltip({
                    "layerId": params.layerId,
                    "status": "Finished"
                });
                snapshotMenu.disableOption({
                    "layerId": params.layerId,
                    "channel": "query.stop"
                });
            }
        },
        markStopped: function(params) {
            var $badge = context.$('#snapshot-' + params.layerId + ' .badge');
            if(!$badge.hasClass('error') && !$badge.hasClass('finished')) {
                $badge.addClass('stopped');
                exposed.updateTooltip({
                    "layerId": params.layerId,
                    "status": "Stopped"
                });
                snapshotMenu.disableOption({
                    "layerId": params.layerId,
                    "channel": "query.stop"
                });
            }
        },
        markError: function(params) {
            var $badge = context.$('#snapshot-' + params.layerId + ' .badge');

            $badge.addClass('error');
            exposed.updateTooltip({
                    "layerId": params.layerId,
                    "status": "Error"
                });
            snapshotMenu.disableOption({
                    "layerId": params.layerId,
                    "channel": "query.stop"
                });
        },
        setTooltip: function(params) {
            var $owner = context.$('#snapshot-' + params.layerId),
                name = $owner.attr('name'),
                count = context.sandbox.dataStorage.datasets[params.layerId].length || 0;

            // Must destroy existing tooltip to be able to add modify it
            $owner.tooltip('destroy'); 
            // Add new tooltip with div id in the HTML to uniquely identify teh tooltip
            $owner.tooltip({
                "html": true,
                "title": 
                    '<div id="snapshot-' + params.layerId + '-tooltip-content">Name: ' + name + '<br/>' +
                    'Status: '+ params.status + '<br/>' +
                    'Features: ' + count + '</div>'
            });
        },
        updateTooltip: function(params) {
            var $owner = context.$('#snapshot-' + params.layerId),
                name = $owner.attr('name'),
                count = context.sandbox.dataStorage.datasets[params.layerId].length || 0,
                tooltipContent = '<div id="snapshot-' + params.layerId + '-tooltip-content">Name: ' + name + '<br/>' + 'Status: '+ params.status + '<br/>' + 'Features: ' + count + '</div>';

            // Some hoops to jump through to dynamically update the tooltip:
            // Set data-original-title with new content, then run fixtitle to make bootstrap update the value
            $owner.attr('data-original-title', tooltipContent).tooltip('fixTitle');
            // Extra steps to refresh if tooltip is open: check if this snapshot's tooltip is open, close and reopen
            if($('.tooltip').find('#snapshot-' + params.layerId + '-tooltip-content').length > 0 && $('.tooltip').find('#snapshot-' + params.layerId + '-tooltip-content').css('display') != 'none') {
                $owner.tooltip('hide').tooltip('show');
            }
        },
        timelinePlaybackStart: function(params) {
            if(checkLayerCount() > 1) {
                stopTimelinePlayback = false;

                var tempArray = [];
                context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(layerId, collections) {
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
                timer = setInterval(function() {
                    if(!stopTimelinePlayback && context.sandbox.dataStorage.datasets[tempArray[i]]) {
                        if(i > 3) {
                            var leftPos = $timeline.scrollLeft();
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
        timelinePlaybackStop: function(params) {
            clearInterval(timer);
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
        deleteLayer: function(params) {

            // TODO: Move this to be handled by the data services (will require reasonable refactor)
            // context.sandbox.utils.ajax({
            //     type: 'DELETE',
            //     url: '/clear/' + params.layerId,
            //     headers: {
            //         'x-meridian-session-id': context.sandbox.sessionId
            //     }
            // });

            if(context.sandbox.dataStorage.datasets[params.layerId]) {
                // TODO: do not use deleteDataLayer since the renderer is already receiving the call.
                delete context.sandbox.dataStorage.datasets[params.layerId];

                publisher.publishMessage({ // TODO: move to mock after the delete call is moved out of here
                    "messageType": "success",
                    "messageTitle": "Data Service",
                    "messageText": "Layer successfully removed"
                });

                // Take care of AOI and toggleBtn state
                exposed.deleteAOILayer({
                    "layerId": params.layerId
                });
                exposed.deleteSnapshot({
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
        deleteSnapshotLayerGroup: function (params) {
            exposed.deleteSnapshot({
                 "layerId": params.layerId
            });
            exposed.deleteDataLayer({
                 "layerId": params.layerId
            });
            exposed.deleteAOILayer({
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
        deleteDataLayer: function(params) {
            //delete data from datastorage.
            delete context.sandbox.dataStorage.datasets[params.layerId];
            publisher.publishMessage({ // TODO: move to mock after the delete call is moved out of here
                "messageType": "success",
                "messageTitle": "Data Service",
                "messageText": "Layer successfully removed"
            });
            publisher.deleteLayer({"layerId": params.layerId});
        },
        showAOILayer: function(params) {
            if(context.sandbox.stateManager.layers[params.layerId + '_aoi']) {
                context.sandbox.stateManager.layers[params.layerId + '_aoi'].visible = true;
                publisher.showLayer({"layerId": params.layerId + '_aoi'});
            }
        },
        hideAOILayer: function(params) {
            if(context.sandbox.stateManager.layers[params.layerId + '_aoi']) {
                context.sandbox.stateManager.layers[params.layerId + '_aoi'].visible = false;
                publisher.hideLayer({"layerId": params.layerId + '_aoi'});
            }
        },
        deleteAOILayer: function(params) {
            publisher.deleteLayer({"layerId": params.layerId + '_aoi'});
        },
        layerToggleOn: function(params) {
            var $querySnapshot = context.$('#snapshot-' + params.layerId);
            $querySnapshot.find('.btn-on').addClass('btn-primary');
            $querySnapshot.find('.btn-off').removeClass('btn-primary');
            snapshotMenu.disableOption({
                    "layerId": params.layerId,
                    "channel": "timeline.menu.layer.show"
                });
            snapshotMenu.enableOption({
                    "layerId": params.layerId,
                    "channel": "timeline.menu.layer.hide"
                });
            snapshotMenu.enableOption({
                    "layerId": params.layerId,
                    "channel": "map.zoom.toLayer"
                });
        },
        layerToggleOff: function(params) {
            var $querySnapshot = context.$('#snapshot-' + params.layerId);
            $querySnapshot.find('.btn-on').removeClass('btn-primary');
            $querySnapshot.find('.btn-off').addClass('btn-primary');
            snapshotMenu.enableOption({
                    "layerId": params.layerId,
                    "channel": "timeline.menu.layer.show"
                });
            snapshotMenu.disableOption({
                    "layerId": params.layerId,
                    "channel": "timeline.menu.layer.hide"
                });
            snapshotMenu.disableOption({
                    "layerId": params.layerId,
                    "channel": "map.zoom.toLayer"
                });
        },
        deleteSnapshot: function(params) {
            var layerState,
                $badge = context.$('#snapshot-' + params.layerId + ' .badge'),
                $owner = context.$('#snapshot-' + params.layerId);
            //destroy tooltip.
            $owner.tooltip('destroy');
            //make sure layer query is finished. If not, stop query before deleting.
            layerState = context.sandbox.stateManager.getLayerStateById({
                "layerId": params.layerId
            });
            if(layerState) {
                dataTransferState = layerState.dataTransferState;
                if(dataTransferState !== 'error' && dataTransferState !== 'stopped' && dataTransferState !== 'finished') {
                    publisher.stopQuery({
                        "layerId": params.layerId
                    });
                }
            }
            //delete timeline snapshot
            context.$('#snapshot-' + params.layerId).parent().remove();
            //delete layer menu.
            $timeline.siblings('#snapshot-' + params.layerId + '-settings-menu').remove();
            //hide timeline if no other layers are present.
            if(context.sandbox.utils.size(context.sandbox.dataStorage.datasets) === 0) {
                exposed.hideTimeline();
                publisher.closeTimeline();
            }
        }
    };

    function checkLayerCount() {
        if(context.sandbox.stateManager.layers) {
            return context.sandbox.utils.size(context.sandbox.stateManager.layers);
        } else {
            return 0;
        }
    }

    return exposed;
});