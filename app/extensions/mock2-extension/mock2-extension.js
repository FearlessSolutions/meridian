define([
    'text!./mock2-info-win.hbs',
    'text!./mock2-info-win.css',
    'handlebars'
], function(mock2Hbs, mock2InfoWinCSS) {
    var exposed = {
        initialize: function(app) {
            app.sandbox.utils.addCSS(mock2InfoWinCSS, 'mock2-extension-style');

            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }
            app.sandbox.dataServices.mock2 = {};
            app.sandbox.dataServices.mock2.infoWinTemplate = {
                buildInfoWinTemplate: function(attributes, fullFeature) {
                    var mock2Template = Handlebars.compile(mock2Hbs);
                    var html = mock2Template({
                        "thumbnail": app.sandbox.icons.getIconForFeature(fullFeature).iconLarge || app.sandbox.icons.getIconForFeature(fullFeature).icon,
                        "classification": attributes.classification,
                        "name": attributes.name,
                        "attributes": attributes,
                        "namespace": "mock2-extension"
                    });
                    return html;
                },
                postRenderingAction: function(feature, layerId) {
                    return;
                }
            };
            app.sandbox.dataServices.mock2.keys = [
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