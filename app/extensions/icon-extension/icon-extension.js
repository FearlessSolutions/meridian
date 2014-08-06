define([
], function () {

    var context,
        currentIcons = {};

    var exposed = {
        initialize: function(app) {
            context = app;
            app.sandbox.icons = {
                getIconForFeature: function(feature) {
                    var iconData = calculateIcon(feature);
                    if (!currentIcons[iconData.icon]){
                        currentIcons[iconData.icon] = iconData;
                    }
                    return iconData;
                },
                getCurrentIcons: function() {
                    return currentIcons;
                },
                clearCurrentIcons: function() {
                    currentIcons = {};
                }
            };
        }
    };

    function calculateIcon(feature) {
        if(feature.style) {
            // If a style is provided on the feature, use it
            return feature.style;
        } else {
            // Otherwise use a default configuration
            return context.sandbox.mapConfiguration.markerIcons.default;
        }
    }

    return exposed;

});