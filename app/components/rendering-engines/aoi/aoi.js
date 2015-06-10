/**
 * Applies handlers to buttons
 * Gets and checks the disk file
 * Runs the upload
 * Sends everything to the map
 */
define([
    'bootstrap'

], function () {
    var context,
        mediator;

    var exposed = {
        init: function(thisContext, thisMediator) {
            context = thisContext;
            mediator = thisMediator;
        },

        createAOI: function(params){
            var layerId = params.layerId,
                name = params.name,
                coords = params.coords;

            if(!layerId ||
                !context.sandbox.dataStorage.datasets[layerId] ||
                !coords){
                return;
            }

            //This should be ignored if the layer exists (handled in renderer)
            //publisher.createLayer({
            mediator.createLayer({
                layerId: layerId + '_aoi',
                name: name + '_aoi',
                initialVisibility: true,
                styleMap: {
                    default: {
                        strokeColor: '#000',
                        strokeOpacity: 0.3,
                        strokeWidth: 2,
                        fillColor: 'gray',
                        fillOpacity: 0.3
                    }
                }
            });

            mediator.setLayerIndex({
                layerId: layerId + '_aoi',
                layerIndex: 0
            });

            mediator.plotFeatures({
                layerId: layerId + '_aoi',
                data: [{
                    layerId: layerId + '_aoi',
                    featureId: '_aoi',
                    dataService: '',
                    id: '_aoi',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[
                            [coords.minLon, coords.maxLat],
                            [coords.maxLon, coords.maxLat],
                            [coords.maxLon, coords.minLat],
                            [coords.minLon, coords.minLat]
                        ]]
                    },
                    type: 'Feature'
                }]
            });

            //if(coords){
            //    createNewAOIFeature(layerId, coords);
            //}
        },
        updateAOI: function(params){
            var layerId = params.layerId,
                coords = params.coords;

            if(!layerId ||
                !context.sandbox.dataStorage.datasets[layerId] ||
                !coords){
                return;
            }

            createNewAOIFeature(layerId, coords);
        },
        clear: function() {
           //TODO?
        },

        showAOILayer: function(params) {
            if(context.sandbox.stateManager.layers[params.layerId + '_aoi']) {
                context.sandbox.stateManager.layers[params.layerId + '_aoi'].visible = true;
                mediator.showAOILayer({layerId: params.layerId + '_aoi'});
            }
        },
        hideAOILayer: function(params) {
            if(context.sandbox.stateManager.layers[params.layerId + '_aoi']) {
                context.sandbox.stateManager.layers[params.layerId + '_aoi'].visible = false;
                mediator.hideAOILayer({layerId: params.layerId + '_aoi'});
            }
        },
        deleteAOILayer: function(params) {
            if(context.sandbox.stateManager.layers[params.layerId + '_aoi']) {
                var layerId = params.layerId;
                delete context.sandbox.stateManager.layers[layerId + '_aoi'];
                mediator.deleteAOILayer({layerId: layerId + '_aoi'});
                delete context.sandbox.dataStorage.datasets[layerId]; //TODO this should be implemented in each datasource instead; catches snapshot menu call for now.
            };
        }
    };

    //function createNewAOIFeature(layerId, coords){
    //    mediator.publishUpdateData({
    //        "layerId": layerId + "_aoi",
    //        "data": [{
    //            "layerId": layerId + "_aoi",
    //            "featureId": "_aoi",
    //            "dataService": "",
    //            "id": "_aoi",
    //            "geometry": {
    //                "type": "Polygon",
    //                "coordinates": [[
    //                    [coords.minLon, coords.maxLat],
    //                    [coords.maxLon, coords.maxLat],
    //                    [coords.maxLon, coords.minLat],
    //                    [coords.minLon, coords.minLat]
    //                ]]
    //            },
    //            "type": "Feature"
    //        }]
    //    });
    //}

    return exposed;
});