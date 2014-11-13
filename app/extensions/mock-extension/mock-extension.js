define([
    'text!./mock-info-win.hbs',
    'text!./mock-info-win.css',
    'text!./mock-map-url.hbs',
    './mock-configuration',
    'jquery',
    'bootstrap',
    'handlebars'
], function(mockHbs, mockInfoWinCSS, mapUrlHBS, mockConfig, $) {
    var context,
        mapUrlTemplate;

    var exposed = {
        initialize: function(app) {
            context = app;
            mapUrlTemplate = Handlebars.compile(mapUrlHBS);

            app.sandbox.utils.addCSS(mockInfoWinCSS, 'mock-extension-style');

            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }
            app.sandbox.dataServices.mock = {
                infoWinTemplate: {
                    buildInfoWinTemplate: function(attributes, fullFeature) {
                        var mockTemplate = Handlebars.compile(mockHbs);
                        var html;

                        //Add the url
                        attributes.mapUrl = processMapUrl(attributes);

                        html = mockTemplate({
                            thumbnail: app.sandbox.icons.getIconForFeature(fullFeature).iconLarge || app.sandbox.icons.getIconForFeature(fullFeature).icon,
                            classification: attributes.classification,
                            name: attributes.name,
                            attributes: attributes,
                            namespace: 'mock-extension',
                            exports: mockConfig.exports
                        });

                        return html;
                    },
                    postRenderingAction: function(feature, layerId) {
                        $('.mock-extension .infoDiv .exportFeature .btn').on('click', function(){
                            var channelName = $('.mock-extension .infoDiv .exportFeature select').find(':selected').val();
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
                keys: [
                    {
                        property: 'percent',
                        displayName: '%',
                        weight: 76
                    },
                    {
                        property: 'color',
                        displayName: 'Color',
                        weight: 69
                    }
                ],
                processMapUrl: processMapUrl
            };
        }
    };

    function processMapUrl(attributes){
        return mapUrlTemplate({
            lat: attributes.lat,
            lon: attributes.lon
        });
    }

    return exposed;
});