define([
    './../libs/v3.0.0/build/ol-debug' //TODO make this 'ol'
], function() {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context,
        mapClustering,
        mapLayers,
        map,
        publisher,
        selector;

    var exposed = {
        init: function(modules) {
            context = modules.context;
            mapClustering = modules.clustering;
            mapLayers = modules.layers;
            publisher = modules.publisher;
        },
        setMap: function(params){
            map = params.map;
        },
        /**
         * Create the basic map and set default values for initial viewport
         * @param params
         * @returns {ol.Map}
         */
        addSelector: function(params) {
            selector = new ol.interaction.Select({
                condition: ol.events.condition.click,
                layers: function(layer){ //Layers that can be selected will have the 'selectable' property
                    if(layer.get('selectable')){
                        return true;
                    } else{
                        return false;
                    }
                },
                style: function(feature, resolution){
                    if(feature.get('features')){ //It is a cluster
                        return mapClustering.getSelectedClusterStyling({
                            feature: feature,
                            resolution: resolution
                        });
                    } else {
                        return mapLayers.getSelectedFeatureStyling({
                            feature: feature,
                            resolution: resolution
                        });
                    }
                }
            });
            map.addInteraction(selector);
            map.on('moveend', function(event){ //On zoom, remove selected stuff
                exposed.clearMapSelection();
            });

            return map;
        },
        addSelectionToLayer: function(params){
            var layer = params.layer; // (ol.layer.Layer)
            layer.on('change:visible', deselectByLayer);
        },
        clearMapSelection: function(params) {
            selector.unselectAll();
        },
        clearMapPopups: function(params) {
            while(map.popups.length) {
                map.removePopup(map.popups[0]);
            }

            context.sandbox.stateManager.removeAllIdentifiedFeatures();
        },
        identifyFeature: function(params) { // TODO: what is this being used by? A: Nothing right now. There isn't even a subscriber.
            var popup,
                feature = params.feature,
                anchor;

            anchor = {size: new ol.Size(0, 0), offset: new ol.Pixel(0, -(feature.attributes.height/2))};
            popup = new ol.Popup.FramedCloud(
                'popup',
                ol.LonLat.fromString(feature.geometry.toShortString()), //TODO centroid
                null,
                params.content,
                anchor,
                true,
                function() {
                    exposed.clearMapSelection({});
                    exposed.clearMapPopups({});
                }
            );

            feature.popup = popup;
            map.addPopup(popup);
        },
        deselectByLayer: function(params){
            var layerId = params.layerId;


        }
    };

    function deselectByLayer(event){
        var layer = event.target;

        if(layer.isVisible()){
            return; //Don't do anything if it's now visible
        }


    }

    return exposed;
});