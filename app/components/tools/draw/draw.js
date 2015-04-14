define([
    './draw-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        MENU_DESIGNATION = 'query-tool',
        $modal,
        $maxLon,
        $maxLat,
        $minLon,
        $minLat,
        isActive;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            isActive = false;
            $modal = context.$('#query-modal');
            $minLon = context.$('.query-form #query-location-minLon');
            $minLat = context.$('.query-form #query-location-minLat');
            $maxLon = context.$('.query-form #query-location-maxLon');
            $maxLat = context.$('.query-form #query-location-maxLat');

        },
        open: function(params) {
            isActive = true;
            var drawOnDefault = true;
            if(context.sandbox.queryConfiguration && 
                typeof context.sandbox.queryConfiguration.queryDrawOnDefault !== undefined) {
                drawOnDefault = context.sandbox.queryConfiguration.queryDrawOnDefault; 
            }

            if(drawOnDefault) {
                closeMenu();
                publisher.drawBBox();
            } else {
                //TODO Publish that the menu is opening (if it is)
                $modal.modal('toggle');

                publisher.removeBBox();
                exposed.populateCoordinates(context.sandbox.stateManager.getMapExtent());
            }
        },
        close: function(params) {
            isActive = false;
            closeMenu();
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
                publisher.deactivateDrawTool();
            }
        },
        populateCoordinates: function(params) {
            $minLon.val(params.minLon);
            $minLat.val(params.minLat);
            $maxLon.val(params.maxLon);
            $maxLat.val(params.maxLat);
        },
        clear: function(){
            $modal.modal('hide');
        },
        handleMenuOpening: function(params){
            if(params.componentOpening === MENU_DESIGNATION){
                return;
            }else{
                closeMenu();
            }
        }
    };

    function closeMenu(){
        //$modal.modal('hide');
        publisher.removeBBox();
    }

    return exposed;
});