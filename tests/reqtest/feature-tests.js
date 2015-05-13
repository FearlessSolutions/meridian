define([
    'chai',
    'meridian-config',
    'aura/aura',
    'mocha'
], function(chai, configuration, Aura) {

//This doesnt work on the command line by doing $ mocha <thisFile>
//Unless there is a way of including the require.js file and the config file in the command
//prompt, I only see this working in the browser.

    var assert = chai.assert,
        expect = chai.expect,
        should = chai.should(); // Note that should has to be executed
    function iThrowError() {
        throw new Error("Error thrown");
    }

//start your test here.
//mocha needs to see describe globally. If you try putting it in a function, it wont excecute. (Unless my test wasn't good.)
    describe('Feature Channels', function () {
        var cmapiMain, renderer, exitBeforeEach, meridian;

        //Read up on hooks: there might be a way of doing this outside the describe for a cleaner look.
        beforeEach(function (done) {
            exitBeforeEach = done;//Aura.then() function wont have access to done. I store it here and then call it.
            meridian = Aura({
                appName: 'Meridian',
                mediator: {maxListeners: 50},
                version: '1.0.0',
                releaseDate: '02/27/2015',
                cmapiVersion: '1.2.0',
                debug: true,
                sources: {default: 'components'}
            });
            //these extensions have .hbs files being loaded. Unless we host the test/index.html
            //it will throw the following error: Cross origin requests are only supported for protocol schemes.
            meridian.use('extensions/system-configuration-extension/system-configuration-extension')
                .use('extensions/utils-extension/utils-extension')
                .use('extensions/ajax-handler-extension/ajax-handler-extension')
                .use('extensions/session-extension/session-extension')
                .use('test/extensions/test-external-pubsub-extension/test-external-pubsub-extension') // added new
                .use('extensions/state-manager-extension/state-manager-extension')
                .use('extensions/data-storage-extension/data-storage-extension')
                // .use('extensions/splash-screen-extension/splash-screen-extension')
                .use('extensions/snapshot-extension/snapshot-extension')
                .use('extensions/map-configuration-extension/map-configuration-extension')
                .use('extensions/user-settings-extension/user-settings-extension')
                .use('extensions/support-configuration-extension/support-configuration-extension')
                .use('extensions/icon-extension/icon-extension')
                // .use('extensions/locator-extension/locator-query-extension')
                .use('extensions/exports/export-utils/export-utils')
                // .use('extensions/exports/geojson-extension/geojson-extension')
                // .use('extensions/exports/csv-extension/csv-extension')
                // .use('extensions/exports/kml-extension/kml-extension')
                // .use('extensions/exports/googlemaps-extension/googlemaps-extension')
                // .use('extensions/data-services/mock-extension/mock-extension')
                // .use('extensions/data-services/fake-extension/fake-extension')
                .use('extensions/cmapi-extension/cmapi-extension')  // added for cmapi
                // .use('extensions/upload-data-extension/upload-data-extension')
                .start({components: 'body'})
                .then(function () {
                    console.log('in then', meridian);
                    //start test
                    //must wait until aura starts before doing anything test related.
                    //If not, meridian variable will be undefined.
                    exitBeforeEach();

                });//end of then

        });//end of beforeEach

        // Capture Feature Plot
        it("Base Test: Feature Plot (coordinates, p1, style)", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                "overlayId": "testOverlayId1",
                                "featureId": "theCMAPIfeatureId_loc",
                                "name": "Test Name 1",
                                "format": "geojson",
                                "feature": {
                                    "type": "FeatureCollection",
                                    "features": [
                                        {
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [
                                                    -5,
                                                    10
                                                ]
                                            },
                                            "properties": {
                                                "p1": "pp1"
                                            },
                                            "style": {
                                                "height": 24,
                                                "width": 24,
                                                "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
                                                "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
                                            }
                                        }
                                    ]
                                },
                                "zoom": false,
                                "readOnly": false
                            },
                            beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCreateCount,
                            index;
                        //test goes here
                        meridian.sandbox.on('map.layer.create', function(params) {
                            afterLayerCreateCount = map.layers.length;
                            expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                            index = -1;
                            var searchTerm = "testOverlayId1",
                                mapLayers = map.layers;
                            for(var i= 0, len = mapLayers.length; i < len; i++) {
                                if(mapLayers[i].layerId === searchTerm) {
                                    index = i;
                                    break;
                                }
                            }
                            expect(index).to.not.equal(-1); // confirms map.feature.plot added a layer and one with the overlayId, 'testOverlayId1'
                            console.debug('Layer exists, create layer successful with expected overlayId');
                        });
                        meridian.sandbox.on('map.features.plot', function(params) {

                            expect( map.layers[index]["features"].length).is.above(0); // confirm feature added to layer
                            var plottedFeature = map.layers[index]["features"][0]; // confirm featureId exists / despite not in payload
                            expect("featureId" in plottedFeature).is.true;
                            var convertedCoords = map.layers[index]["features"][0]["geometry"]['bounds'].transform(map.projection, map.projectionWGS84),
                                actualLat = convertedCoords["left"],
                                actualLon = convertedCoords["top"];
                            // expected payload Lat is -5, actual Lat should be somewhat close (factoring in mathematical conversion)
                            expect(actualLat).to.be.below(-4.999999999).and.above(-5.000000001);
                            console.debug("The actual latitude value for the plotted feature is within 9 decimal places of the expected value");
                            // expected payload Lon is 10, actual Lat should be somewhat close (factoring in mathematical conversion)
                            expect(actualLon).to.be.above(9.999999999).and.below(10.000000001);
                            console.debug("The actual longitude value for the plotted feature is within 9 decimal places of the expected value");
                            var actualp1 = plottedFeature["attributes"]["p1"],
                                actualSH = plottedFeature["attributes"]["height"],
                                actualSW = plottedFeature["attributes"]["width"],
                                actualSI = plottedFeature["attributes"]["icon"];
                            expect(actualp1).to.equal(payload.feature.features[0].properties.p1);
                            console.debug("The actual p1 value for the plotted feature is equal to the expected p1 value for the plotted feature");
                            expect(actualSH).to.equal(payload.feature.features[0].style.height);
                            console.debug("The actual style.height value for the plotted feature is equal to the expected style.height value for the plotted feature");
                            expect(actualSW).to.equal(payload.feature.features[0].style.width);
                            console.debug("The actual style.width value for the plotted feature is equal to the expected style.width value for the plotted feature");
                            expect(actualSI).to.equal(payload.feature.features[0].style.icon);
                            console.debug("The actual style.icon value for the plotted feature is equal to the expected style.icon value for the plotted feature");
                            done();
                        });
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.feature.plot', message: payload }}); // manual publish to the channel
                    }
                };
                cmapiMain.initialize.call(meridian, meridian);
                var $fixtures = $('#fixtures');
                meridian.html = $fixtures.html;
                renderer.initialize.call(meridian, meridian);
            });
        });//it

        it("Base Test: Feature Plot (featureId)", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                "overlayId": "testOverlayId1",
                                "featureId": "theCMAPIfeatureId_loc",
                                "name": "Test Name 1",
                                "format": "geojson",
                                "feature": {
                                    "type": "FeatureCollection",
                                    "features": [
                                        {
                                            //"id": "featureId_applicationuses",
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [
                                                    -5,
                                                    10
                                                ]
                                            },
                                            "properties": {
                                                "p1": "pp1"
                                            },
                                            "style": {
                                                "height": 24,
                                                "width": 24,
                                                "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
                                                "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
                                            }
                                        }
                                    ]
                                },
                                "zoom": false,
                                "readOnly": false
                            },
                            beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCreateCount,
                            index;
                        //test goes here
                        meridian.sandbox.on('map.layer.create', function(params) {
                            afterLayerCreateCount = map.layers.length;
                            expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                            index = -1;
                            var searchTerm = "testOverlayId1",
                                mapLayers = map.layers;
                            for(var i= 0, len = mapLayers.length; i < len; i++) {
                                if(mapLayers[i].layerId === searchTerm) {
                                    index = i;
                                    break;
                                }
                            }
                            expect(index).to.not.equal(-1); // confirms map.feature.plot added a layer and one with the overlayId, 'testOverlayId1'
                            console.debug('Layer exists, create layer successful with expected overlayId');
                        });
                        meridian.sandbox.on('map.features.plot', function(params) {
                            console.debug(map);
                            expect( map.layers[index]["features"].length).is.above(0); // confirm feature added to layer
                            var plottedFeature = map.layers[index]["features"][0]; // confirm featureId exists / despite not in payload
                            expect("featureId" in plottedFeature).is.true;
                            console.debug('featureId property added to feature');
                            // application use of feature id (location @ featureId_applicationuses) is not the same as CMAPI spec, THIS WILL CAUSE TEST TO FAIL
                            expect(payload.featureId).to.equal(plottedFeature["featureId"]);
                            done();
                        });
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.feature.plot', message: payload }}); // manual publish to the channel
                    }
                };
                cmapiMain.initialize.call(meridian, meridian);
                var $fixtures = $('#fixtures');
                meridian.html = $fixtures.html;
                renderer.initialize.call(meridian, meridian);
            });
        });//it
        it("Edge case: Feature Plot (Feature in layer created prior to plot emit)", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                overlayId: "layerCreatedBeforePlotEmit1"
                            },
                            payload2 = {
                                "overlayId": "layerCreatedBeforePlotEmit1",
                                "name": "Test Name 1",
                                "format": "geojson",
                                "feature": {
                                    "type": "FeatureCollection",
                                    "features": [
                                        {
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [
                                                    -5,
                                                    10
                                                ]
                                            },
                                            "properties": {
                                                "p1": "pp1"
                                            },
                                            "style": {
                                                "height": 24,
                                                "width": 24,
                                                "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
                                                "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
                                            }
                                        }
                                    ]
                                },
                                "zoom": false,
                                "readOnly": false
                            },
                            beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCreateCount,
                            actualLayer;
                        //test goes here
                        meridian.sandbox.on('map.layer.create', function(params) {
                            afterLayerCreateCount = map.layers.length;
                            expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount); // confirmation that a layer was created
                            map.layers[map.layers.length-1];  //  last layer added
                            actualLayer = map.layers[map.layers.length-1];
                            expect(actualLayer).to.exist;
                            expect(actualLayer.layerId).to.equal(payload.overlayId);  // actual layerId should equal the payload overlayId
                            meridian.sandbox.external.receiveMessage({data:{channel:'map.feature.plot', message: payload2 }}); // manual publish to the channel
                        });
                        meridian.sandbox.on('map.features.plot', function(params) {
                            var confirmPlot = map.layers[map.layers.length-1];
                            expect(confirmPlot["features"].length).is.above(0); // confirm feature added to layer
                            console.debug('Feature was added to layer that was created prior to the plot emit');
                            done();
                        });
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.create', message: payload }}); // manual publish to the channel
                    }
                };
                cmapiMain.initialize.call(meridian, meridian);
                var $fixtures = $('#fixtures');
                meridian.html = $fixtures.html;
                renderer.initialize.call(meridian, meridian);
            });
        });//it
        it("Edge case: Feature Plot (Feature exists in default layer when layerId is not declared in the payload)", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                "overlayId": "",
                                "name": "Test Name 1",
                                "format": "geojson",
                                "feature": {
                                    "type": "FeatureCollection",
                                    "features": [
                                        {
                                            "id": "testFeatureId09",
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [
                                                    -5,
                                                    10
                                                ]
                                            },
                                            "properties": {
                                                "p1": "pp1"
                                            },
                                            "style": {
                                                "height": 24,
                                                "width": 24,
                                                "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
                                                "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
                                            }
                                        }
                                    ]
                                },
                                "zoom": false,
                                "readOnly": false
                            },
                            beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCreateCount,
                            actualLayer;
                        //test goes here
                        meridian.sandbox.on('map.layer.create', function(params) {
                            afterLayerCreateCount = map.layers.length;
                            expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount); // confirmation that a layer was created
                            map.layers[map.layers.length-1];  //  last layer added
                            actualLayer = map.layers[map.layers.length-1];
                            expect(actualLayer).to.exist;
                            expect(actualLayer.layerId).to.equal('cmapi');  // actual layerId should equal the default layerId, 'cmapi'
                            console.debug('The defaultId, cmapi, was assigned to the created layer, since the payload did not provide one');
                        });
                        meridian.sandbox.on('map.features.plot', function(params) {
                            var confirmPlot = map.layers[map.layers.length-1];  // grab layer that has cmapi layerId
                            expect(confirmPlot["features"][0]["featureId"]).to.equal(payload.feature.features[0].id); // confirm feature added to default layer
                            console.debug('Feature was added to default layer, cmapi');
                            done();
                        });
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.feature.plot', message: payload }}); // manual publish to the channel
                    }
                };
                cmapiMain.initialize.call(meridian, meridian);
                var $fixtures = $('#fixtures');
                meridian.html = $fixtures.html;
                renderer.initialize.call(meridian, meridian);
                //done();
            });
        });//it



        //
        //
        //it("Base Test: Feature Plot Batch - DEFUNCT", function (done) {
        //
        //    // This Unit Test (And Channel) might be irrelevant, as it doesn't seem to provide any real advantages
        //    // over the basic map.feature.plot channel. You can plot multiple points there, and also define the
        //    // same amount of data.
        //
        //    require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
        //        console.log('in it', meridian);
        //        meridian.sandbox.external.postMessageToParent = function (params) {
        //            if (params.channel == 'map.status.ready') {
        //
        //                var map = renderer.getMap(),
        //                    payload = {
        //                        //    PROBLEM: It doesn't like "features" being an Array. It expects Features to be an object.
        //                        "features": [
        //                            {
        //                                "type": "Feature",
        //                                "geometry": {
        //                                    "type": "Point",
        //                                    "coordinates": [
        //                                        -10,
        //                                        10
        //                                    ]
        //                                },
        //                                "properties": {
        //                                    "p1": "pp1"
        //                                },
        //                                "style": {
        //                                    "height": 24,
        //                                    "width": 24,
        //                                    "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
        //                                    "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
        //                                }
        //                            },
        //                            {
        //                                "type": "Feature",
        //                                "geometry": {
        //                                    "type": "Point",
        //                                    "coordinates": [
        //                                        50,
        //                                        10
        //                                    ]
        //                                },
        //                                "properties": {
        //                                    "p1": "pp1"
        //                                },
        //                                "style": {
        //                                    "height": 24,
        //                                    "width": 24,
        //                                    "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
        //                                    "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
        //                                }
        //                            },
        //                            {
        //                                "type": "Feature",
        //                                "geometry": {
        //                                    "type": "Point",
        //                                    "coordinates": [
        //                                        10,
        //                                        50
        //                                    ]
        //                                },
        //                                "properties": {
        //                                    "p1": "pp1"
        //                                },
        //                                "style": {
        //                                    "height": 24,
        //                                    "width": 24,
        //                                    "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
        //                                    "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
        //                                }
        //                            }
        //                        ],
        //                        "overlayId": "testOverlayId1",
        //                        "format": "geojson",
        //                        "zoom": false,
        //                        "readOnly": false
        //                },
        //                    beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
        //                    afterLayerCreateCount,
        //                    index;
        //                //test goes here
        //                meridian.sandbox.on('map.layer.create', function(params) {
        //                    afterLayerCreateCount = map.layers.length;
        //                    expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
        //                    index = -1;
        //                    var searchTerm = "testOverlayId1",
        //                        mapLayers = map.layers;
        //                    for(var i= 0, len = mapLayers.length; i < len; i++) {
        //                        if(mapLayers[i].layerId === searchTerm) {
        //                            index = i;
        //                            break;
        //                        }
        //                    }
        //                    expect(index).to.not.equal(-1); // confirms map.feature.plot added a layer and one with the overlayId, 'testOverlayId1'
        //                    console.debug('Layer exists, create layer successful with expected overlayId');
        //                });
        //                meridian.sandbox.on('map.features.plot', function(params) {
        //                    // PSEUDOCODE: Maybe tick up a "plottedCount" variable.
        //                      done();
        //                });
        //                meridian.sandbox.external.receiveMessage({data:{channel:'map.feature.plot', message: payload }}); // manual publish to the channel
        //                    // PSEUDOCODE: Wait maybe 500ms, then run expectations to see;
        //                    // A. Does the map currently have the proper number of features specified in the Payload?
        //                    // B. Do the coordinates between plotted points and Payload match?
        //            }
        //        };
        //        cmapiMain.initialize.call(meridian, meridian);
        //        var $fixtures = $('#fixtures');
        //        meridian.html = $fixtures.html;
        //        renderer.initialize.call(meridian, meridian);
        //    });
        //});//it





    });//describe
});

