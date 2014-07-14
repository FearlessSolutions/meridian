define([
    'text!./cmapi-info-win.hbs',
    'text!./cmapi-info-win.css',
    './cmapi-configuration',
    "handlebars"
], function(cmapiHBS, cmapiCSS, cmpiConfiguration) {   
    var exposed = {
        initialize: function(app) {
            app.sandbox.utils.addCSS(cmapiCSS, 'cmapi-extension-style');

            if(!app.sandbox.cmapi){
                app.sandbox.cmapi={
                    "sub":{},
                    "pub":{}
                };
            }else{
                if(!app.sandbox.cmapi.sub){
                    app.sandbox.cmapi.sub = {}
                }
                if(!app.sandbox.cmapi.pub){
                    app.sandbox.cmapi.pub = {};
                }
            }
            app.sandbox.cmapi.sub.channels = cmpiConfiguration.subscribeChannels;
            app.sandbox.cmapi.pub.channels = cmpiConfiguration.publishChannels;

            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }

            app.sandbox.dataServices.cmapi = {};
            app.sandbox.dataServices.cmapi.infoWinTemplate = {
                "buildInfoWinTemplate": function(attributes){
                    var cmapiTemplate = Handlebars.compile(cmapiHBS);
                    var html = cmapiTemplate({
                        "thumbnail": "./extensions/map-configuration-extension/images/markerIcons/marker.png",
                        "classification": "?????", //TODO make this dynamic?
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
