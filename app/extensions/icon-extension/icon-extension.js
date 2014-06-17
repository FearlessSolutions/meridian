define([
], function () {

    var context,
        currentIcons = {};

    var exposed = {
        initialize: function(app) {
            context = app;
            app.sandbox.icons = {
                getIconForFeature: function(feature){
                    var iconData = calculateIcon(feature);
                    if (!currentIcons[iconData.icon]){
                        currentIcons[iconData.icon] = iconData;
                    }
                    return iconData;
                },
                getCurrentIcons: function(){
                    return currentIcons;
                },
                clearCurrentIcons: function(){
                    currentIcons = {};
                }
            };
        }
    };

    function calculateIcon(feature){
        // If a style is provided on the feature, use it
        if (feature.properties && feature.properties.style){
            return feature.properties.style;
        }

        // Otherwise use a default configuration
        return context.sandbox.mapConfiguration.markerIcons.default;
    }

    return exposed;

});