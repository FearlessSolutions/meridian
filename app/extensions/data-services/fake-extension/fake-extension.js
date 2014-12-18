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
                            // .text() = Human Readable, .val() = channel name
                            var channelName = $('.' + config.namespace + ' .infoDiv .exportFeature select').find(':selected').val();
                            switch(channelName){
                                case 'export.download.geojson':
                                    context.sandbox.emit(channelName, {featureId: feature.featureId});
                                    break;
                                case 'export.google.maps':
                                    context.sandbox.dataStorage.getFeatureById({featureId: feature.featureId}, function(feature){
                                        context.sandbox.emit(channelName, {lat: feature.geometry.coordinates[1],
                                            lon: feature.geometry.coordinates[0]});
                                    });
                                    break;
                                default:
                                    console.log('ERROR: Unknown channel -- ' + channelName);
                            }
                        });
                    }
                },
                //See data-storage-extension for key variable descriptions
                keys: config.keys
            };
        }
    };

    return exposed;
});