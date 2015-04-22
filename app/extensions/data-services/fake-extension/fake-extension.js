define([
    'text!./fake-info-win.hbs',
    'text!./fake-info-win.css',
    './fake-configuration',
    'jquery',
    'bootstrap',
    'handlebars'
], function(infoWinHBS, infoWinCSS,config, $) {

    var context,
        DATASOURCE_NAME;

    var exposed = {
        initialize: function(app) {
            var datasource;

            context = app;
            DATASOURCE_NAME = config.DATASOURCE_NAME;

            app.sandbox.utils.addCSS(infoWinCSS, 'fake-extension-style');

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
            app.sandbox.dataServices[config.DATASOURCE_NAME] = {
                DATASOURCE_NAME: config.DATASOURCE_NAME,
                DISPLAY_NAME: config.DISPLAY_NAME,
                infoWinTemplate: {
                    buildInfoWinTemplate: function(attributes, fullFeature) {
                        var fakeTemplate = Handlebars.compile(infoWinHBS);

                        return fakeTemplate({
                            thumbnail: app.sandbox.icons.getIconForFeature(fullFeature).iconLarge || app.sandbox.icons.getIconForFeature(fullFeature).icon,
                            classification: attributes.classification,
                            name: attributes.name,
                            attributes: attributes,
                            namespace: config.namespace,
                            exports: config.exports
                        });
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
                //See data-storage-extension for key variable descriptions
                keys: config.keys
            };

            //Add the datasource to the export options
            app.sandbox.export.utils.addDatasource({
                id: DATASOURCE_NAME,
                exports: config.exports
            });
        }
    };

    return exposed;
});