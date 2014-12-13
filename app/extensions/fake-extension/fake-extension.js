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
                //See data-storage-extension for key variable descriptions
                keys: [
                    {
                        property: 'valid',
                        displayName: 'Valid',
                        weight: 75
                    }
                ]
            };
        }
    };

    return exposed;
});