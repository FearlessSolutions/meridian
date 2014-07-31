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
                    //     "cluster": true
                    // }
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
                }
			};

            app.sandbox.stateManager = stateManager;

        }
    };

    return exposed;

});
