/**
 * Sets up the CMAPI channels to listen for from the parent
 * Some utility functions to help parse geoJSON
 */
define([
    'text!./cmapi-info-win.hbs',
    'text!./cmapi-info-win.css',
    './cmapi-configuration',
    "handlebars"
], function(cmapiHBS, cmapiCSS, cmpiConfiguration) {   
    var exposed = {
        /**
         * Initialize the extension:
         * -Set up the availible pu and sub postMessage channels
         * -Put the helper functions in the sandbox
         * -Set up a mock cmapi "dataService'
         * @param app
         */
        initialize: function(app) {
            app.sandbox.utils.addCSS(cmapiCSS, 'cmapi-extension-style');

            //Set up parent channels
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

            //Put utility function in sandbox
            app.sandbox.cmapi.getMaxExtent = getMaxExtent;
            app.sandbox.cmapi.thisName = "meridian";

            //Set up CMAPI as a 'dataService'
            if (!app.sandbox.dataServices) {
                app.sandbox.dataServices = {};
            }

            app.sandbox.dataServices.cmapi = {};
            app.sandbox.dataServices.cmapi.infoWinTemplate = {
                "buildInfoWinTemplate": function(attributes){
                    var cmapiTemplate = Handlebars.compile(cmapiHBS);
                    var html = cmapiTemplate({
                        "thumbnail": "./extensions/map-configuration-extension/images/markerIcons/marker.png",
                        "classification": attributes.classification || "????", //TODO make this dynamic?
                        "name": attributes.name,
                        "attributes": attributes
                    });
                    return html;
                },
                "postRenderingAction": function(feature, overlayId){ return; }
            };
        }
    };

    /**
     * Recursive function to find max extent of any geoJSON geometry.
     * Also,  marks the center of the extent
     * @param currentCoords The current point in the geometry; either coordinates, or an array leading to coordinates
     * @param maxExtent The current max extent; If null, is set to first found coordinate to start
     * @returns {*}
     */
    function getMaxExtent (currentCoords, maxExtent){
        var lat,
            lon;

        if(!maxExtent){
            maxExtent = { //Set so that first found coordinate will overwrite
                "minLat": 90,
                "minLon": 180,
                "maxLat": -90,
                "maxLon": -180
            };
        }

        if(Array.isArray(currentCoords[0])){
            currentCoords.forEach(function(nextCoords){
                maxExtent = getMaxExtent(nextCoords, maxExtent);
            });
        }else{ //Is at the lowest level
            lon = currentCoords[0];
            lat = currentCoords[1];

            if(lat < maxExtent.minLat){
                maxExtent.minLat = lat;
            }
            if(lon < maxExtent.minLon){
                maxExtent.minLon = lon;
            }
            if(lat > maxExtent.maxLat){
                maxExtent.maxLat = lat;
            }
            if(lon > maxExtent.maxLon){
                maxExtent.maxLon = lon;
            }
        }

        maxExtent.center = {
            "lat": ((maxExtent.minLat + maxExtent.maxLat) / 2.0),
            "lon": ((maxExtent.minLon + maxExtent.maxLon) / 2.0)
        };

        return maxExtent;
    }

    var test =
    {
        "overlayId":"multipolygon",
        "format":"geojson",
        "feature":{
            "type":"FeatureCollection",
            "features":[
                {
                    "type":"Feature",
                    "geometry":{
                        "type": "Polygon",
                        "coordinates": [
                        [[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]],
                        [[20, 30], [35, 35], [30, 20], [20, 30]]
                        ]

                    },
                    "properties":{
                    }
                },
                {
                    "type":"Feature",
                    "geometry":{

                        "type": "MultiPolygon",
                        "coordinates": [
                        [
                            [[40, 40], [20, 45], [45, 30], [40, 40]]
                            ],
                            [
                            [[20, 35], [10, 30], [10, 10], [30, 5], [45, 20], [20, 35]],
                            [[30, 20], [20, 15], [20, 25], [30, 20]]
                            ]
                        ]

                    },
                    "properties":{
                    }
                },
                {
                    "type":"Feature",
                    "geometry":{

                        "type": "MultiLineString",
                        "coordinates": [
                            [[10, 10], [20, 20], [10, 40]],
                            [[40, 40], [30, 30], [40, 20], [30, 10]]
                            ]
                    },
                    "properties":{
                    }
                }
            ]
        },
        "name":"Multi polygon",
        "zoom":"true",
        "readOnly":"false"
    }

    return exposed;
});
