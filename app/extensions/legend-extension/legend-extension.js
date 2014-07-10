define([
], function () {

    var context,
        currentIcons = {};

    var exposed = {
        initialize: function(app) {
            context = app;
            app.sandbox.legend = {
                getIconForLegend: function (id) {
                    return id;
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