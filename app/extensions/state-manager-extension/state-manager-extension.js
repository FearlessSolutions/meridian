define([], function(){
    var exposed = {
        initialize: function(app) {
            var mapReadyCallbacks = [],
                stateManager = {
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
                        //     "visible": false,
                        //     "hiddenFeatures": ["featureId1", "featureId2", ..., "featureIdN"],
                        //     "identifiedFeatures": ["featureId1", "featureId2", ..., "featureIdN"],
                        //     "selectedFeatures": ["featureId1", "featureId2", ..., "featureIdN"]
                        // }
                    },
                    getMapState: function() {
                        return stateManager.map;
                    },
                    setMapState: function(params) {
                        app.sandbox.utils.extend(true, stateManager.map, params.state);
                    },
                    triggerMapStatusReady: function(){
                        stateManager.setMapState({"status": {"ready": true}});
                        app.sandbox.utils.each(mapReadyCallbacks, function(index, callback) {
                            callback();
                        });
                        mapReadyCallbacks = [];
                    },
                    addMapReadyCallback: function(newCallback) {
                        if(stateManager.getMapState().status.ready) {
                            newCallback();
                        } else {
                            mapReadyCallbacks.push(newCallback);
                        }
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
                    getAllHiddenFeatures: function() {
                        var hiddenFeatures = [];
                        app.sandbox.utils.each(stateManager.layers, function(layerId, layerState){
                            hiddenFeatures.concat(layerState.hiddenFeatures);
                        });
                        return hiddenFeatures;
                    },
                    getFeatureVisibility: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            if(stateManager.layers[params.layerId].hiddenFeatures.indexOf(params.featureId) === -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    getHiddenFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            return stateManager.layers[params.layerId].hiddenFeatures;
                        }
                    },
                    /**
                     * Overwrite array of featureIds associated with layer
                     * @param {Array} params.featureIds - Array of featureIds to be hidden
                     * @param {string} params.layerId - Id of layer
                     */
                    setHiddenFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            stateManager.layers[params.layerId].hiddenFeatures = [];
                            app.sandbox.utils.each(params.featureIds, function(index, featureId) {
                                if(stateManager.layers[params.layerId].hiddenFeatures.indexOf(featureId) === -1) {
                                    stateManager.layers[params.layerId].hiddenFeatures.push(featureId);
                                }
                            });
                        }
                    },
                    addHiddenFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            app.sandbox.utils.each(params.featureIds, function(index, featureId) {
                                if(stateManager.layers[params.layerId].hiddenFeatures.indexOf(featureId) === -1) {
                                    stateManager.layers[params.layerId].hiddenFeatures.push(featureId);
                                }
                            });
                        }
                    },
                    removeHiddenFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            var hiddenFeatures = stateManager.layers[params.layerId].hiddenFeatures;
                            app.sandbox.utils.each(params.featureIds, function(index, featureId) {
                                if(hiddenFeatures.indexOf(featureId) !== -1) {
                                    hiddenFeatures.splice(hiddenFeatures.indexOf(featureId), 1);
                                }
                            });
                        }
                    },
                    getAllIdentifiedFeatures: function(params) {
                        var identifiedFeatures = [];
                        app.sandbox.utils.each(stateManager.layers, function(layerId, layerState){
                            identifiedFeatures.concat(layerState.identifiedFeatures);
                        });
                        return identifiedFeatures;
                    },
                    getIdentifiedFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            return stateManager.layers[params.layerId].identifiedFeatures;
                        }
                    },
                    setIdentifiedFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            stateManager.layers[params.layerId].identifiedFeatures = [];
                            app.sandbox.utils.each(params.featureIds, function(index, featureId) {
                                if(stateManager.layers[params.layerId].identifiedFeatures.indexOf(featureId) === -1) {
                                    stateManager.layers[params.layerId].identifiedFeatures.push(featureId);
                                }
                            });
                        }
                    },
                    addIdentifiedFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            app.sandbox.utils.each(params.featureIds, function(index, featureId) {
                                if(stateManager.layers[params.layerId].identifiedFeatures.indexOf(featureId) === -1) {
                                    stateManager.layers[params.layerId].identifiedFeatures.push(featureId);
                                }
                            });
                        }
                    },
                    removeIdentifiedFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            var identifiedFeatures = stateManager.layers[params.layerId].identifiedFeatures;
                            app.sandbox.utils.each(params.featureIds, function(index, featureId) {
                                if(identifiedFeatures.indexOf(featureId) !== -1) {
                                    identifiedFeatures.splice(identifiedFeatures.indexOf(featureId), 1);
                                }
                            });
                        }
                    },
                    removeAllIdentifiedFeatures: function() {
                        app.sandbox.utils.each(stateManager.layers, function(layerId, layerState){
                            layerState.identifiedFeatures = [];
                        });
                    }
                };

            app.sandbox.stateManager = stateManager;

        }
    };

    return exposed;

});
