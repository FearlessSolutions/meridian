define([], function(){
    /**
     * @exports state-manager-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.stateManager} to the {@link Sandbox} namespace.
         * @function
         * @instance
         * @param  {Object} app Instance of the Meridian application.
         * @memberof module:state-manager-extension
         */
        initialize: function(app) {
            var mapReadyCallbacks = [],
                stateManager = {
                    /**
                     * @namespace Sandbox.stateManager.map
                     * @memberof Sandbox.stateManager
                     */
                    "map": {
                        // "visualMode": "cluster" 
                        // Other properties that could be in Map.Status
                        /**
                         * @namespace Sandbox.stateManager.map.status
                         * @memberof Sandbox.stateManager.map
                         * @property {Boolean} ready - Initial value is false.
                         */
                        "status": {
                            "ready": false
                        },
                        /**
                         * @namespace Sandbox.stateManager.map.extent
                         * @memberof Sandbox.stateManager.map
                         */
                        "extent": {}
                    },
                    /**
                     * @namespace Sandbox.stateManager.layers
                     * @memberof Sandbox.stateManager
                     */
                    "layers": {
                        // "SomeLayer": {   
                        //     "visible": false,
                        //     "hiddenFeatures": ["featureId1", "featureId2", ..., "featureIdN"],
                        //     "identifiedFeatures": ["featureId1", "featureId2", ..., "featureIdN"],
                        //     "selectedFeatures": ["featureId1", "featureId2", ..., "featureIdN"]
                        // }
                    },
                    /**
                     * Returns {@link Sandbox.stateManager.map}
                     * @function
                     * @instance
                     * @memberof Sandbox.stateManager
                     */
                    getMapState: function() {
                        return stateManager.map;
                    },
                    /**
                     * Sets the map state on state manager.
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {String} params.state
                     * @memberof Sandbox.stateManager
                     */
                    setMapState: function(params) {
                        app.sandbox.utils.extend(true, stateManager.map, params.state);
                    },
                    /**
                     * Triggers ...
                     * @function
                     * @instance
                     * @memberof Sandbox.stateManager
                     */
                    triggerMapStatusReady: function(){
                        stateManager.setMapState({"status": {"ready": true}});
                        app.sandbox.utils.each(mapReadyCallbacks, function(index, callback) {
                            callback();
                        });
                        mapReadyCallbacks = [];
                    },
                    /**
                     * Adds callbacks to map ready in state manager.
                     * @function
                     * @instance
                     * @param {Function} newCallback
                     * @memberof Sandbox.stateManager
                     */
                    addMapReadyCallback: function(newCallback) {
                        if(stateManager.getMapState().status.ready) {
                            newCallback();
                        } else {
                            mapReadyCallbacks.push(newCallback);
                        }
                    },
                    /**
                     * Returns map extent from stateManager.
                     * @function
                     * @instance
                     * @memberof Sandbox.stateManager
                     */
                    getMapExtent: function() {
                        return stateManager.map.extent;
                    },
                    /**
                     * Sets the state manager map extent.
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {String} params.extent - The extent to be set.
                     * @memberof Sandbox.stateManager
                     */
                    setMapExtent: function(params) {
                        stateManager.map.extent = params.extent;
                    },
                    /**
                     * Returns the state manager layer based on layerId.
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {String} params.layerId - Layer Id to return.
                     * @memberof Sandbox.stateManager
                     */
                    getLayerStateById: function(params) {
                        return stateManager.layers[params.layerId];
                    },
                    /**
                     * Set layer state by layer Id.
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {String} params.layerId - Id of the layer being targeted.
                     * @memberof Sandbox.stateManager
                     */
                    setLayerStateById: function(params) {
                        if(!stateManager.layers[params.layerId]) {
                            stateManager.layers[params.layerId] = params.state;
                        } else {
                            app.sandbox.utils.extend(true, stateManager.layers[params.layerId], params.state);
                        }
                        return stateManager.layers[params.layerId];
                    },
                    /**
                     * Returns all hidden features.
                     * @function
                     * @instance
                     * @memberof Sandbox.stateManager
                     */
                    getAllHiddenFeatures: function() {
                        var hiddenFeatures = [];
                        app.sandbox.utils.each(stateManager.layers, function(layerId, layerState){
                            hiddenFeatures.concat(layerState.hiddenFeatures);
                        });
                        return hiddenFeatures;
                    },
                    /**
                     * Returns feature visibility based on Id.
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {String} params.layerId - Id of the feature.
                     * @memberof Sandbox.stateManager
                     */
                    getFeatureVisibility: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            if(stateManager.layers[params.layerId].hiddenFeatures.indexOf(params.featureId) === -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    /**
                     * Returns hidden features based on layer Id.
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {String} params.layerId - Id of the layer.
                     * @memberof Sandbox.stateManager
                     */
                    getHiddenFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            return stateManager.layers[params.layerId].hiddenFeatures;
                        }
                    },
                    /**
                     * Overwrite/set array of featureIds associated with layer
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {Array} params.featureIds - Array of featureIds to be hidden
                     * @param {String} params.layerId - Id of the layer.
                     * @memberof Sandbox.stateManager
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
                    /**
                     * Add array of featureIds associated with layer
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {Array} params.featureIds - Array of featureIds to be added.
                     * @param {String} params.layerId - Id of the layer.
                     * @memberof Sandbox.stateManager
                     */
                    addHiddenFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            app.sandbox.utils.each(params.featureIds, function(index, featureId) {
                                if(stateManager.layers[params.layerId].hiddenFeatures.indexOf(featureId) === -1) {
                                    stateManager.layers[params.layerId].hiddenFeatures.push(featureId);
                                }
                            });
                        }
                    },
                    /**
                     * Remove array of featureIds associated with layer
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {Array} params.featureIds - Array of featureIds to be removed.
                     * @param {String} params.layerId - Id of the layer.
                     * @memberof Sandbox.stateManager
                     */
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
                    /**
                     * Remove all featureIds associated with layer.
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {String} params.layerId - Id of the layer.
                     * @memberof Sandbox.stateManager
                     */
                    removeAllHiddenFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            stateManager.layers[params.layerId].hiddenFeatures = [];
                        }
                    },
                    /**
                     * Returns array of all identified features in state manager.
                     * @function
                     * @instance
                     * @memberof Sandbox.stateManager
                     */
                    getAllIdentifiedFeatures: function() {
                        var identifiedFeatures = {};
                        app.sandbox.utils.each(stateManager.layers, function(layerId, layerState){
                            identifiedFeatures[layerId] = layerState.identifiedFeatures;
                        });
                        return identifiedFeatures;
                    },
                    /**
                     * Returns array of identified featureIds associated with layer.
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {String} params.layerId - Id of the layer.
                     * @memberof Sandbox.stateManager
                     */
                    getIdentifiedFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            return stateManager.layers[params.layerId].identifiedFeatures;
                        }
                    },
                    /**
                     * Override/set array of identified featureIds associated with layer.
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {Array} params.featureIds - Array of identified featureIds to be set.
                     * @param {String} params.layerId - Id of the layer.
                     * @memberof Sandbox.stateManager
                     */
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
                    /**
                     * Add array of identified featureIds associated with layer.
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {Array} params.featureIds - Array of identified featureIds to be added.
                     * @param {String} params.layerId - Id of the layer.
                     * @memberof Sandbox.stateManager
                     */
                    addIdentifiedFeaturesByLayerId: function(params) {
                        if(stateManager.layers[params.layerId]) {
                            app.sandbox.utils.each(params.featureIds, function(index, featureId) {
                                if(stateManager.layers[params.layerId].identifiedFeatures.indexOf(featureId) === -1) {
                                    stateManager.layers[params.layerId].identifiedFeatures.push(featureId);
                                }
                            });
                        }
                    },
                    /**
                     * Remove array of identified featureIds associated with layer.
                     * @function
                     * @instance
                     * @param {Object} params
                     * @param {Array} params.featureIds - Array of featureIds to be removed.
                     * @param {String} params.layerId - Id of the layer.
                     * @memberof Sandbox.stateManager
                     */
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
                    /**
                     * Remove all identified featureIds.
                     * @function
                     * @instance
                     * @memberof Sandbox.stateManager
                     */
                    removeAllIdentifiedFeatures: function() {
                        app.sandbox.utils.each(stateManager.layers, function(layerId, layerState){
                            layerState.identifiedFeatures = [];
                        });
                    }
                };
            /**
             * @namespace Sandbox.stateManager
             * @memberof Sandbox
             */
            app.sandbox.stateManager = stateManager;

        }
    };

    return exposed;

});
