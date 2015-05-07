define([
    './../map-api-publisher',
    './layers',
    './../libs/leaflet-src'
], function(publisher, mapLayers) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context,
        map;

    var exposed = {
        init: function(thisContext, thisMap) {
            var cursorLocation;
            context = thisContext;
            map = thisMap;

            //Set initial value of map extent, in the state manager
            context.sandbox.stateManager.setMapExtent({
                extent: {
                    minLon: context.sandbox.mapConfiguration.initialMinLon,
                    minLat: context.sandbox.mapConfiguration.initialMinLat,
                    maxLon: context.sandbox.mapConfiguration.initialMaxLon,
                    maxLat: context.sandbox.mapConfiguration.initialMaxLat
                }
            });

            //Listen for map movents and update the map extent in the state manager
            map.on('moveend', function(evt) {
                var currentExtent = map.getBounds();
                context.sandbox.stateManager.setMapExtent({
                    extent: {
                        minLon: currentExtent.getWest(),
                        minLat: currentExtent.getSouth(),
                        maxLon: currentExtent.getEast(),
                        maxLat: currentExtent.getNorth()
                    }
                });
            });

            //Check if there is a user setting; If no user setting, use default true.
            cursorLocation = context.sandbox.cursorLocation;
            if(!cursorLocation
                || !('defaultDisplay' in cursorLocation)
                || cursorLocation.defaultDisplay){
                map.on('mousemove', function(e) {
                    var position = e.latlng;
                    publisher.publishMousePosition({
                        lat: position.lat,
                        lon: position.lng
                    });
                });
            }

            exposed.zoomToExtent({
                map: map,
                minLon: context.sandbox.mapConfiguration.initialMinLon,
                minLat: context.sandbox.mapConfiguration.initialMinLat,
                maxLon: context.sandbox.mapConfiguration.initialMaxLon,
                maxLat: context.sandbox.mapConfiguration.initialMaxLat
            });
        },
        zoomIn: function(params) {
            params.map.zoomIn();
        },
        zoomOut: function(params) {
            params.map.zoomOut();
        },
        /**
         * Zoom to bbox
         * @param params
         */
        zoomToExtent: function(params) {
            var southWest = L.latLng(params.minLat, params.minLon),
                northEast = L.latLng(params.maxLat, params.maxLon),
                bounds = L.latLngBounds(southWest, northEast);
            map.fitBounds(bounds);
        },
        /**
         * Zoom to extent of layer DATA
         * @param params
         */
        zoomToLayer: function(params) {
            var layer = mapLayers.getActiveLayer();

            if(layer && layer.getBounds(params.layerId)) {
                map.fitBounds(layer.getBounds(params.layerId));
            }
        },
        /**
         * Zoom to features (all features in array must belong to the same layer)
         * @param params
         */
        zoomToFeatures: function(params) {
            var layer = map.getLayersBy('layerId', params.layerId)[0],
                bounds = new OpenLayers.Bounds(),
                featuresFound = false;

            if(layer) {
                // TODO: make it also work in cluster mode (to check through the features in clusters)
                context.sandbox.utils.each(params.featureIds, function(index, featureId) {
                    var feature = layer.getFeatureBy('featureId', featureId),
                        featureExtent;

                    if(feature) {
                        featureExtent = feature.geometry.getBounds();
                        bounds.extend(featureExtent);
                        featuresFound = true;
                    } else {
                        // feature is likely in a cluster
                        context.sandbox.utils.each(layer.features, function(k1, v1) {
                        if(v1.cluster) {
                            context.sandbox.utils.each(v1.cluster, function(k2, singleFeature) {
                                if(singleFeature.featureId === featureId) {
                                    featureExtent = singleFeature.geometry.getBounds();
                                    bounds.extend(featureExtent);
                                    featuresFound = true;
                                }
                            });
                        }
                    });
                    }
                });

                if(featuresFound) {
                   map.zoomToExtent(bounds);
                } else {
                    publisher.publishMessage({
                        messageType: 'warning',
                        messageTitle: 'Zoom to Features',
                        messageText: 'Features not found.'
                    });
                }
            } else {
                publisher.publishMessage({
                    messageType: 'warning',
                    messageTitle: 'Zoom to Features',
                    messageText: 'Features not found.'
                });
            }
        },
        /**
         * Pan to given point and zoom to zoom-level-8
         * @param params
         */
        setCenter: function(params) {
            var centerPoint,
                lat = params.lat,
                lon = params.lon;

            centerPoint = new OpenLayers.LonLat(lon, lat);
            map.setCenter(centerPoint.transform(map.projectionWGS84, map.projection), 8);
        }
    };
    
    return exposed;
});