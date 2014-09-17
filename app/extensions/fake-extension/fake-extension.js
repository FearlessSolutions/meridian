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
                "infoWinTemplate": {
                    "buildInfoWinTemplate": function(attributes, fullFeature) {
                        var fakeTemplate = Handlebars.compile(fakeHbs);
                        var html = fakeTemplate({
                            "thumbnail": app.sandbox.icons.getIconForFeature(fullFeature).iconLarge || app.sandbox.icons.getIconForFeature(fullFeature).icon,
                            "classification": attributes.classification,
                            "name": attributes.name,
                            "attributes": attributes,
                            "namespace": "fake-extension"
                        });
                        return html;
                    },
                    "postRenderingAction": function(feature, layerId) {
                        return;
                    }
                },
                "keys": {
                    "valid": "Valid"
                }
            };
        }
    };

    return exposed;
});