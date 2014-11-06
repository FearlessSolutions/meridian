define([
    'text!./fake-info-win.hbs',
    'text!./fake-info-win.css',
    './fake-configuration',
    'jquery',
    'bootstrap',
    'handlebars'
], function(fakeHbs, fakeInfoWinCSS, fakeConfig, $) {

    var context;

    var exposed = {
        initialize: function(app) {

            context = app;

            app.sandbox.utils.addCSS(fakeInfoWinCSS, 'fake-extension-style');

            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }
            app.sandbox.dataServices.fake = {
                "infoWinTemplate": {
                    "buildInfoWinTemplate": function(attributes, fullFeature) {
                        var fakeTemplate = Handlebars.compile(fakeHbs);
                        var html = fakeTemplate({
                            "thumbnail": app.sandbox.icons.getIconForFeature(fullFeature).iconLarge || app.sandbox.icons.getIconForFeature(fullFeature).icon,
                            "classification": attributes.classification,
                            "name": attributes.name,
                            "attributes": attributes,
                            "namespace": "fake-extension",
                            "exports": fakeConfig.exports
                        });
                        return html;
                    },
                    "postRenderingAction": function(feature, layerId) {
                        $('.fake-extension .exportFeature .exportGroup .btn').on('click', function(){
                            // .text() = Human Readable, .val() = channel name
                            var channelName = $('.fake-extension .exportFeature .exportGroup select').find(':selected').val();
                            switch(channelName){
                                case "export.download.geojson":
                                    context.sandbox.emit(channelName, {featureId: feature.featureId});
                                    break;
                                case "export.google.maps":
                                    context.sandbox.dataStorage.getFeatureById({featureId: feature.featureId}, function(feature){
                                        context.sandbox.emit(channelName, {lat: feature.geometry.coordinates[1],
                                            lon: feature.geometry.coordinates[0]});
                                    });
                                    break;
                                default:
                                    console.log("ERROR: Unknown channel -- " + channelName);
                            }
                        });
                    }
                },
                "keys": {
                    "valid": "Valid"
                }
            };
        }
    };

    return exposed;
});