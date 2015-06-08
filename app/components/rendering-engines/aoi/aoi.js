/**
 * Applies handlers to buttons
 * Gets and checks the disk file
 * Runs the upload
 * Sends everything to the map
 */
define([
    './aoi-publisher'
], function (publisher) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        createAOI: function(args){
            var layerId = args.layerId,
                name = args.name,
                coords = args.coords;

            if(!layerId ||
                !context.sandbox.dataStorage.datasets[layerId] ||
                !coords){
                return;
            }

            //This should be ignored if the layer exists (handled in renderer)
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

            if(coords){
                createNewAOIFeature(layerId, coords);
            }
        },
        updateAOI: function(args){
            var layerId = args.layerId,
                coords = args.coords;

            if(!layerId ||
                !context.sandbox.dataStorage.datasets[layerId] ||
                !coords){
                return;
            }

            createNewAOIFeature(layerId, coords);
        },
        clear: function() {
           //TODO?
        }
    };

    function createNewAOIFeature(layerId, coords){
        publisher.publishUpdateData({
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
    }

    return exposed;
});