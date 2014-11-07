define([
    'text!./fake-info-win.hbs',
    'text!./fake-info-win.css',
    'handlebars'
], function(fakeHbs, fakeInfoWinCSS) {
    var exposed = {
        initialize: function(app) {
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
                            namespace: 'fake-extension'
                        });
                    },
                    postRenderingAction: function(feature, layerId) {
                        return;
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