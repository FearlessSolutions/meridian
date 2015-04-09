define([
], function (publisher) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
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