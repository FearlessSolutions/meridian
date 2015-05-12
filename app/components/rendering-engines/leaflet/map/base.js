define([
    './../map-api-publisher',
    './../libs/leaflet-src'
], function(publisher) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },

        clearMapPopups: function(params) {
            while(params.map.popups.length) {
                params.map.removePopup(params.map.popups[0]);
            }

            context.sandbox.stateManager.removeAllIdentifiedFeatures();
        },
        identifyFeature: function(params) { // TODO: what is this being used by? A: Nothing right now. There isn't even a subscriber.
            var popup,
                feature = params.feature,
                anchor;

            anchor = {"size": new OpenLayers.Size(0, 0), "offset": new OpenLayers.Pixel(0, -(feature.attributes.height/2))};
            popup = new OpenLayers.Popup.FramedCloud(
                'popup',
                OpenLayers.LonLat.fromString(feature.geometry.toShortString()), //TODO centroid
                null,
                params.content,
                anchor,
                true,
                function() {
                    exposed.clearMapSelection({
                    });
                    exposed.clearMapPopups({
                    });
                }
            );

            feature.popup = popup;
            params.map.addPopup(popup);
        }

    };
    return exposed;
});