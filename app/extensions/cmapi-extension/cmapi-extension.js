/**
 * Sets up the CMAPI channels to listen for from the parent
 * Some utility functions to help parse geoJSON
 */
define([
    'text!./cmapi-info-win.hbs',
    'text!./cmapi-info-win.css',
    "handlebars"
], function(cmapiHBS, cmapiCSS) {   
    var exposed = {
        /**
         * Initialize the extension:
         * -Set up the availible pub and sub postMessage channels
         * -Put the helper functions in the sandbox
         * -Set up a mock cmapi "dataService'
         * @param app
         */
        initialize: function(app) {
            app.sandbox.utils.addCSS(cmapiCSS, 'cmapi-extension-style');

            //Set up parent channels
            if(!app.sandbox.cmapi) {
                app.sandbox.cmapi = {};
            }

            //Put utility function in sandbox
            app.sandbox.cmapi.thisName = "meridian";

            //Set up CMAPI as a 'dataService'
            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }

            app.sandbox.dataServices.cmapi = {};
            app.sandbox.dataServices.cmapi.infoWinTemplate = {
                "buildInfoWinTemplate": function(attributes) {
                    var cmapiTemplate = Handlebars.compile(cmapiHBS);
                    var html = cmapiTemplate({
                        "thumbnail": "./extensions/map-configuration-extension/images/markerIcons/marker.png",
                        "classification": attributes.classification || "", //TODO make this dynamic?
                        "name": attributes.name,
                        "attributes": attributes
                    });
                    return html;
                },
                "postRenderingAction": function(feature, overlayId){ return; }
            };
        }
    };

    return exposed;
});
