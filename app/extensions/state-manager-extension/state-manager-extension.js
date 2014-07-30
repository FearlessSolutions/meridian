define([], function(){
    var exposed = {
        initialize: function(app) {
            var stateManager = {
                "map": {
                    // "visualMode": "cluster" 
                    // Other properties that could be in Map.Status
                    "status": {
                        "ready": false
                    },
                    "extent": {}
                },
                "layers": {
                    // "SomeLayer": {   
                    //     "visibility": false,
                    //     "hiddenFeatures": ["featureId1", "featureId2", ..., "featureIdN"]
                    // }
                },
                getMapState: function() {
                    return stateManager.map;
                },
                setMapState: function(params) {
                    app.sandbox.utils.extend(true, stateManager.map, params.state);
                },
                getMapExtent: function() {
                    return stateManager.map.extent;
                },
                setMapExtent: function(params) {
                    stateManager.map.extent = params.extent;
                },
                getLayerStateById: function(params) {
                    return stateManager.layers[params.layerId];
                },
                setLayerStateById: function(params) {
                    if(!stateManager.layers[params.layerId]) {
                        stateManager.layers[params.layerId] = params.state;
                    } else {
                        app.sandbox.utils.extend(true, stateManager.layers[params.layerId], params.state);
                    }
                    return stateManager.layers[params.layerId];
                },
                getAllHiddenFeatures: function(params) {
                    app.sandbox.utils.each(stateManager.layers, function(k, v){

                    });
                },
                getFeatureVisibility: function(params) {

                },
                getHiddenFeaturesByLayerId: function(params) {

                },
                /**
                 * Store array of featureIds associated with layer
                 * @param {Array} params.features - Array of featureIds to be hidden
                 * @param {string} params.layerId - Id of layer
                 */
                setHiddenFeaturesByLayerId: function(params) {

                }
			};

            app.sandbox.stateManager = stateManager;

        }
    };

    return exposed;

});
