define([
    'text!./mock-info-win.hbs',
    'text!./mock-info-win.css',
    'text!./mock-map-url.hbs',
    './mock-configuration',
    'jquery',
    'bootstrap',
    'handlebars'
], function(infoWinHBS, infoWinCSS, mapUrlHBS, config, $) {
    var context,
        mapUrlTemplate;

    var exposed = {
        initialize: function(app) {
            context = app;
            mapUrlTemplate = Handlebars.compile(mapUrlHBS);

            app.sandbox.utils.addCSS(infoWinCSS, 'mock-extension-style');

            //Add datasource information to the sandbox
            if(!app.sandbox.datasources){
                app.sandbox.datasources = [];
            }

            datasource = {
                DATASOURCE_NAME: config.DATASOURCE_NAME,
                DISPLAY_NAME: config.DISPLAY_NAME
            };
            app.sandbox.datasources.push(datasource);

            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }
            app.sandbox.dataServices.mock = {
                DATASOURCE_NAME: config.DATASOURCE_NAME,
                DISPLAY_NAME: config.DISPLAY_NAME,
                infoWinTemplate: {
                    buildInfoWinTemplate: function(attributes, fullFeature) {
                        var mockTemplate = Handlebars.compile(infoWinHBS);
                        var html;

                        //Add the url
                        attributes.mapUrl = processMapUrl(attributes);

                        html = mockTemplate({
                            thumbnail: app.sandbox.icons.getIconForFeature(fullFeature).iconLarge || app.sandbox.icons.getIconForFeature(fullFeature).icon,
                            classification: attributes.classification,
                            name: attributes.name,
                            attributes: attributes,
                            namespace: config.namespace,
                            exports: config.exports
                        });

                        return html;
                    },
                    postRenderingAction: function(feature, layerId) {
                        $('.' + config.namespace + ' .infoDiv .exportFeature .btn').on('click', function(){
                            //emiting message to open export picker.
                            context.sandbox.emit("export.picker.open", {featureId: feature.featureId});
                        });
                    }
                },
                //See data-storage-extension for key variable descriptions
                keys: config.keys,
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