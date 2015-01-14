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
                            //emiting message to open export picker.
                            context.sandbox.emit("export.picker.open", {featureId: feature.featureId});
                        });
                    }
                },
                validateForExport: function(option, callback){
                    if(app.sandbox.dataServices.mock.exports[option]){
                        console.log("it was found");
                        callback({
                            "result": true
                        })
                    }
                    else{
                        console.log('it was not found.');
                        callback({
                            "result": false
                        });
                    }

                },
                //See data-storage-extension for key variable descriptions
                keys: mockConfig.keys,
                processMapUrl: processMapUrl,
                exports: mockConfig.exports,
                DATASOURCE_NAME: mockConfig.DATASOURCE_NAME,
                DISPLAY_NAME: mockConfig.DISPLAY_NAME,
                namespace: mockConfig.namespace
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