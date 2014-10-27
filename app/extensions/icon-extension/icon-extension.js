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
        if($.isEmptyObject(feature.style)) {
            // If there is no style, use default
            return context.sandbox.mapConfiguration.markerIcons.default;
        } else {
            // If a style is provided on the feature, use it
            return feature.style;
        }
    }

    return exposed;

});