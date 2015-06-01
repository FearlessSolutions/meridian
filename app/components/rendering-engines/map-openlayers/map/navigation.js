define([
    './../map-api-publisher',
    './../libs/openlayers-2.13.1/OpenLayers'
], function(publisher) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        zoomIn: function(params) {
       //     params.map.zoomIn();
        },
        zoomOut: function(params) {
            params.map.zoomOut();
        },
        /**
         * Zoom to bbox
         * @param params
         */
        zoomToExtent: function(params) {
            var bounds = new OpenLayers.Bounds(params.minLon, params.minLat, params.maxLon, params.maxLat);
            params.map.zoomToExtent(bounds.transform(params.map.projectionWGS84, params.map.projection), true);
        },
        /**
         * Zoom to max extent
         * @param params
         */
        zoomToMaxExtent: function(params) {
            console.log('vcf nav');
            params.map.zoomToMaxExtent();
        },
        /**
         * Zoom to extent of layer DATA
         * @param params
         */
        zoomToLayer: function(params) {
            var layer = params.map.getLayersBy('layerId', params.layerId)[0];
            console.log("Layer ID");
console.log(layerId);
            if(layer && layer.getDataExtent()) {
                params.map.zoomToExtent(layer.getDataExtent());
            } else {
                publisher.publishMessage({
                    messageType: 'warning',
                    messageTitle: 'Zoom to Layer',
                    messageText: 'No data in layer to zoom to.'
                });
            }
        },
        /**
         * Zoom to features (all features in array must belong to the same layer)
         * @param params
         */
        zoomToFeatures: function(params) {
            console.log("Here!");
            var layer = params.map.getLayersBy('layerId', params.layerId)[0],
                bounds = new OpenLayers.Bounds(),
                featuresFound = false;
            console.debug(layer);
            console.debug(bounds);
            console.debug(params);
            console.log("params.featureIds", params.featureIds);
            //  var selectedLayer = map.getLayersBy('layerId', 'testOverlayId1')[0];
            //  console.log("Selected Layer: ", selectedLayer);
            if(layer) {
                // TODO: make it also work in cluster mode (to check through the features in clusters)
                //  var feature = layer.getFeatureBy('featureId', featureId),
                //          featureExtent;
                var selectedLayer = params.map.getLayersBy('layerId', 'testOverlayId1')[0];
                //  console.log(layer.getFeatureBy('featureIds', 'featureId01_')); CANT USE GETFEATUREBY
                var feature = null;
                // THIS IS A PSEUDO GET.FEATUREBY
                for(var i=0, len=selectedLayer.features.length; i<len; ++i) {
                    console.log(i);
                    console.log(selectedLayer.features[i].attributes.featureId);
                    if(selectedLayer.features[i].attributes.featureId == params.featureIds) {
                        console.log("WE DID IT");
                        feature = selectedLayer.features[i];
                        break;
                    }
                }
                if(feature) {
                    var featureExtent = feature.geometry.getBounds();
                    bounds.extend(featureExtent);
                }
                params.map.zoomToExtent(bounds);
                //for(var i=0, len=this.features.length; i<len; ++i) {
                //    if(this.features[i][attributes] == 'featureId01_') {
                //        console.log("WE DID IT");
                //        feature = this.features[i];
                //        break;
                //    }
                //}
                //context.sandbox.utils.each(params.featureIds, function(index, featureId) {
                //    console.log("Index: ", index, ". FeatureId: ", featureId);
                //
                //
                //    var feature = layer.getFeatureBy('featureId', featureId),
                //        featureExtent;
                //
                //    if(feature) {
                //        featureExtent = feature.geometry.getBounds();
                //        bounds.extend(featureExtent);
                //        featuresFound = true;
                //    } else {
                //        // feature is likely in a cluster
                //        context.sandbox.utils.each(layer.features, function(k1, v1) {
                //            if(v1.cluster) {
                //                context.sandbox.utils.each(v1.cluster, function(k2, singleFeature) {
                //                    if(singleFeature.featureId === featureId) {
                //                        featureExtent = singleFeature.geometry.getBounds();
                //                        bounds.extend(featureExtent);
                //                        featuresFound = true;
                //                    }
                //                });
                //            }
                //        });
                //    }
                //});
                //if(featuresFound) {
                //    params.map.zoomToExtent(bounds);
                //} else {
                //    publisher.publishMessage({
                //        messageType: 'warning',
                //        messageTitle: 'Zoom to Features',
                //        messageText: 'Features not found.'
                //    });
                //}
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
            params.map.setCenter(centerPoint.transform(params.map.projectionWGS84, params.map.projection), 8);
        }
    };

    return exposed;
});