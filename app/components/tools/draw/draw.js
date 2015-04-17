define([
    './draw-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        isActive;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            isActive = false;
        },
        open: function() {
            isActive = true;
            publisher.drawBBox();

        },
        reset: function() {
            isActive = false;
            publisher.removeBBox();
        },
        saveShape: function(params) {
            if (isActive) {
                var shapeId = context.sandbox.utils.UUID();

                //publisher.createShapeLayer({
                //    layerId: shapeId + '_aoi',
                //    name: shapeId + '_aoi',
                //    initialVisibility: true,
                //    styleMap: {
                //        default: {
                //            strokeColor: '#000',
                //            strokeOpacity: 0.3,
                //            strokeWidth: 2,
                //            fillColor: '#FF358B',
                //            fillOpacity: 0.2
                //        }
                //    }
                //});
                //publisher.setLayerIndex({
                //    layerId: shapeId + '_aoi',
                //    layerIndex: 0
                //});
                publisher.plotFeatures({
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
                publisher.closeDrawTool();
                exposed.reset();
                // the coordinate emit for the channel here
                publisher.publishCoords(JSON.stringify(
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
                publisher.publishMessage({
                    "messageType": "success",
                    "messageTitle": "Draw Rectangle",
                    "messageText": "Coordinates successfully published"
                });
            }
        }
    };

    return exposed;
});