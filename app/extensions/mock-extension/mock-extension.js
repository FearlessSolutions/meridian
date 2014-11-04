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
        "initialize": function(app) {
            context = app;
            mapUrlTemplate = Handlebars.compile(mapUrlHBS);

            app.sandbox.utils.addCSS(mockInfoWinCSS, 'mock-extension-style');

            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }
            app.sandbox.dataServices.mock = {
                "infoWinTemplate": {
                    "buildInfoWinTemplate": function(attributes, fullFeature) {
                        var mockTemplate = Handlebars.compile(mockHbs);
                        var html;

                        //Add the url
                        attributes.mapUrl = processMapUrl(attributes);

                        html = mockTemplate({
                            "thumbnail": app.sandbox.icons.getIconForFeature(fullFeature).iconLarge || app.sandbox.icons.getIconForFeature(fullFeature).icon,
                            "classification": attributes.classification,
                            "name": attributes.name,
                            "attributes": attributes,
                            "namespace": "mock-extension",
                            "exports": mockConfig.exports
                        });

                        return html;
                    },
                    "postRenderingAction": function(feature, layerId) {
                        $('.mock-extension .exportFeature .exportGroup .btn').on('click', function(){
                            // .text() = Human Readable, .val() = channel name
                            var channelName = $('.mock-extension .exportFeature .exportGroup select').find(':selected').val();
                            switch(channelName){
                                case "export.download.geojson":
                                    console.log("Download GeoJSON Handler");
                                    context.sandbox.emit('export.download.geojson', {featureId: feature.featureId});
                                    break;
                                default:
                                    console.log("ERROR: Unknown channel -- " + channelName);
                            }
                        });
                    }
                },
                "keys": {
                    "percent": "%",
                    "color": "Color"
                },
                "processMapUrl": processMapUrl
            };
        }
    };

    function processMapUrl(attributes){
        return mapUrlTemplate({
            "lat": attributes.lat,
            "lon": attributes.lon
        });
    }

    return exposed;
});