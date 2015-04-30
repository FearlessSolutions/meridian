define([
    'bootstrap'
], function () {
    var context,
        mediator,
        isActive;

    var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;
            isActive = false;
        },
        open: function() {
            isActive = true;
            mediator.drawBBox();

        },
        reset: function() {
            isActive = false;
            mediator.removeBBox();
        },
        saveShape: function(params) {
            if (isActive) {
                var shapeId = context.sandbox.utils.UUID();

                mediator.plotFeatures({
                    layerId: 'static_shape',
                    data: [{
                        layerId: 'static_shape',
                        featureId: shapeId + '_aoi',
                        dataService: '',
                        id: shapeId + '_aoi',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [[
                                [params.minLon, params.maxLat],
                                [params.maxLon, params.maxLat],
                                [params.maxLon, params.minLat],
                                [params.minLon, params.minLat]
                            ]]
                        },
                        type: 'Feature'
                    }]
                });
                mediator.closeDrawTool();
                exposed.reset();
                // the coordinate emit for the channel here
                mediator.publishCoords(JSON.stringify(
                    {
                        featureId: shapeId + '_aoi',
                        properties: { // properties is the CMAPI 1.3.0 spec
                            coordinates: [[
                                [params.minLon, params.maxLat],
                                [params.maxLon, params.maxLat],
                                [params.maxLon, params.minLat],
                                [params.minLon, params.minLat]
                            ]]
                        }
                    }
                ));
                mediator.publishMessage({
                    messageType: 'success',
                    messageTitle: 'Draw Rectangle',
                    messageText: 'Coordinates successfully published'
                });
            }
        }
    };

    return exposed;
});