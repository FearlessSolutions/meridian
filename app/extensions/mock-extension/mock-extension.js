define([
    'text!./mock-info-win.hbs',
    'text!./mock-info-win.css',
    'text!./mock-map-url.hbs',
    'handlebars'
], function(mockHbs, mockInfoWinCSS, mapUrlHBS) {
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
                            namespace: 'mock-extension'
                        });

                        return html;
                    },
                    postRenderingAction: function(feature, layerId) {
                        return;
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