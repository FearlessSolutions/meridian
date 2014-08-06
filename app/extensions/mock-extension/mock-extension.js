define([
    'text!./mock-info-win.hbs',
    'text!./mock-info-win.css',
    'handlebars'
], function(mockHbs, mockInfoWinCSS) {
    var exposed = {
        initialize: function(app) {
            app.sandbox.utils.addCSS(mockInfoWinCSS, 'mock-extension-style');

            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }
            app.sandbox.dataServices.mock = {};
            app.sandbox.dataServices.mock.infoWinTemplate = {
                buildInfoWinTemplate: function(attributes, fullFeature) {
                    var mockTemplate = Handlebars.compile(mockHbs);
                    var html = mockTemplate({
                        "thumbnail": fullFeature.style.iconLarge || fullFeature.style.icon,
                        "classification": attributes.classification,
                        "name": attributes.name,
                        "attributes": attributes,
                        "namespace": "mock-extension"
                    });
                    return html;
                },
                postRenderingAction: function(feature, layerId) {
                    return;
                }
            };
            app.sandbox.dataServices.mock.keys = [
                "classification",
                "layerId",
                "featureId",
                "lat",
                "lon",
                "color"
            ];
        }
    };

    return exposed;
});