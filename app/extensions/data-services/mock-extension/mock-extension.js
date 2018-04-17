define([
    'text!./mock-info-win.hbs',
    'text!./mock-info-win.css',
    'text!./mock-map-url.hbs',
    './mock-configuration',
    'jquery',
    'handlebars',
    'bootstrap'
], function(infoWinHBS, infoWinCSS, mapUrlHBS, config, $, Handlebars) {
    var context,
        DATASOURCE_NAME,
        mapUrlTemplate;

    var exposed = {
        initialize: function(app) {
            var datasource;

            context = app;
            mapUrlTemplate = Handlebars.compile(mapUrlHBS);
            DATASOURCE_NAME = config.DATASOURCE_NAME;

            app.sandbox.utils.addCSS(infoWinCSS, 'mock-extension-style');

            //Add datasource information to the sandbox
            if(!app.sandbox.datasources){
                app.sandbox.datasources = [];
            }

            datasource = {
                DATASOURCE_NAME: DATASOURCE_NAME,
                DISPLAY_NAME: config.DISPLAY_NAME
            };
            app.sandbox.datasources.push(datasource);

            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }
            app.sandbox.dataServices.mock = {
                DATASOURCE_NAME: DATASOURCE_NAME,
                DISPLAY_NAME: config.DISPLAY_NAME,
                infoWinTemplate: {
                    buildInfoWinTemplate: function(attributes, fullFeature) {
                        var mockTemplate = Handlebars.compile(infoWinHBS),
                            html;

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
                            context.sandbox.emit('export.picker.open', {
                                featureId: feature.featureId,
                                layerId: feature.queryId
                            });
                        });
                    }
                },
                validateForExport: function(option, callback){
                    if(app.sandbox.dataServices.mock.exports[option]){
                        callback({
                            result: true
                        });
                    }
                    else{
                        callback({
                            result: false
                        });
                    }
                },
                //See data-storage-extension for key variable descriptions
                keys: config.keys,
                processMapUrl: processMapUrl,
                namespace: config.namespace
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