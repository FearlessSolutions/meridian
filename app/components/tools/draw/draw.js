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
        close: function(params) {
            isActive = false;
            publisher.removeBBox();
        },
        bboxAdded: function(params) {
            if (isActive) {
                exposed.populateCoordinates(params);

                //$modal.modal('show');
                //var shapeObject = {
                //    layerId: 'test',
                //    name: 'test',
                //    dataSourceId: 'mock',
                //    justification: 'justification',
                //    minLat: params.minLat,
                //    minLon: params.minLon,
                //    maxLat: params.maxLat,
                //    maxLon: params.maxLon,
                //    coords: {
                //        minLat: params.minLat,
                //        minLon: params.minLon,
                //        maxLat: params.maxLat,
                //        maxLon: params.maxLon
                //    },
                //    selectable: true,
                //    pageSize: 300
                //};
                //publisher.executeQuery(shapeObject);
                publisher.createShapeLayer({
                    layerId: 'testaoi',
                    name: 'testaoi',
                    initialVisibility: true,
                    styleMap: {

                        strokeColor: '#000',
                        strokeOpacity: 0.3,
                        strokeWidth: 2,
                        fillColor: '#ffc600',
                        fillOpacity: 0.3

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
                //publisher.createShapeLayer(shapeObject);
                publisher.closeDrawTool();
                exposed.close();
            }
        },
        populateCoordinates: function(params) {
            params.minLon;
            params.minLat;
            params.maxLon;
            params.maxLat;
        }
    };

    return exposed;
});