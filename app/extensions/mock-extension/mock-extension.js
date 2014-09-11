define([
    'text!./mock-info-win.hbs',
    'text!./mock-info-win.css',
    'handlebars'
], function(mockHbs, mockInfoWinCSS) {
    var exposed = {
        "initialize": function(app) {
            app.sandbox.utils.addCSS(mockInfoWinCSS, 'mock-extension-style');

            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }
            app.sandbox.dataServices.mock = {
                "infoWinTemplate": {
                    "buildInfoWinTemplate": function(attributes, fullFeature) {
                        var mockTemplate = Handlebars.compile(mockHbs);
                        var html = mockTemplate({
                            "thumbnail": app.sandbox.icons.getIconForFeature(fullFeature).iconLarge || app.sandbox.icons.getIconForFeature(fullFeature).icon,
                            "classification": attributes.classification,
                            "name": attributes.name,
                            "attributes": attributes,
                            "namespace": "mock-extension"
                        });
                        return html;
                    },
                    "postRenderingAction": function(feature, layerId) {
                        return;
                    }
                },
                "keys": {
                    "percent": "%",
                    "color": "Color"
                }
            };
        }
    };

    return exposed;
});