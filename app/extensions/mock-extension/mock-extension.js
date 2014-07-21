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
                buildInfoWinTemplate: function(attributes) {
                    var mockTemplate = Handlebars.compile(mockHbs);
                    var html = mockTemplate({
                        thumbnail: "./extensions/map-configuration-extension/images/markerIcons/marker-2x.png",
                        classification: attributes.classification,
                        name: attributes.name,
                        attributes: attributes
                    });
                    return html;
                },
                postRenderingAction: function(feature, layerId) {
                    return;
                }
            };
            app.sandbox.dataServices.mock.keys = [
                "classification",
                "queryId",
                "featureId",
                "lat",
                "lon",
                "color"
            ];
        }
    };

    return exposed;
});