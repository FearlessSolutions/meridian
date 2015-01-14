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
                infoWinTemplate: {
                    buildInfoWinTemplate: function(attributes, fullFeature) {
                        var fakeTemplate = Handlebars.compile(fakeHbs);

                        return fakeTemplate({
                            thumbnail: app.sandbox.icons.getIconForFeature(fullFeature).iconLarge || app.sandbox.icons.getIconForFeature(fullFeature).icon,
                            classification: attributes.classification,
                            name: attributes.name,
                            attributes: attributes,
                            namespace: 'fake-extension',
                            exports: fakeConfig.exports
                        });
                    },
                    postRenderingAction: function(feature, layerId) {
                        $('.fake-extension .infoDiv .exportFeature .btn').on('click', function(){
                            //emiting message to open export picker.
                            context.sandbox.emit("export.picker.open", {featureId: feature.featureId});
                        });
                    }
                },
                validateForExport: function(option, callback){
                    if(app.sandbox.dataServices.fake.exports[option]){
                        console.log("it was found");
                        callback({
                            "result": true
                        });
                    }
                    else{
                        console.log('it was not found.');
                        callback({
                            "result": false
                        });
                    }

                },
                //See data-storage-extension for key variable descriptions
                keys: fakeConfig.keys,
                exports: fakeConfig.exports,
                DATASOURCE_NAME: fakeConfig.DATASOURCE_NAME,
                DISPLAY_NAME: fakeConfig.DISPLAY_NAME,
                namespace: fakeConfig.namespace

            };
        }
    };

    return exposed;
});