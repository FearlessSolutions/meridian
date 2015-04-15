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
        bboxAdded: function(params) {
            if (isActive) {

                publisher.createShapeLayer({
                    layerId: 'testaoi',
                    name: 'testaoi',
                    initialVisibility: true,
                    styleMap: {
                        default: {
                            strokeColor: '#000',
                            strokeOpacity: 0.3,
                            strokeWidth: 2,
                            fillColor: '#FF358B',
                            fillOpacity: 0.2
                        }
                    }
                });
                publisher.setLayerIndex({
                    layerId: 'testaoi',
                    layerIndex: 0
                });
                publisher.plotFeatures({
                    layerId: 'testaoi',
                    data: [{
                        layerId: 'testaoi',
                        featureId: '_aoi',
                        dataService: '',
                        id: '_aoi',
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
                var emitObject = {
                    featureId: 'something',
                    messageId: 'something',
                    properties: { // properties is the CMAPI 1.3.0 spec
                        coordinates: [[
                            [params.minLon, params.maxLat],
                            [params.maxLon, params.maxLat],
                            [params.maxLon, params.minLat],
                            [params.minLon, params.minLat]
                        ]]
                    }
                }
                publisher.publishCoords(JSON.stringify(emitObject));
            }
        }
    };

    return exposed;
});