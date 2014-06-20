define([], function(){
    var exposed = {
        initialize: function(app) {
            var stateManager = {
                "map": {
                    // "visualMode": "cluster" 
                    // Other properties that could be in Map.Status
                    "status": {
                        "ready": false
                    }
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
                },
                getMapState: function() {
                    return stateManager.map;
                },
                setMapState: function(params) {
                    app.sandbox.utils.extend(true, stateManager.map, params.state);
                }
			};

            app.sandbox.stateManager = stateManager;

        }
    };

    return exposed;

});
