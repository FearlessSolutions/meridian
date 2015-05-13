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
    describe('View Channels', function () {
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

        describe('map.view.zoom.in', function () {
            // Capture the Zoom-in
            it("Base Test: Zoom In (Should Zoom In by 1)", function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        if (params.channel == 'map.status.ready') {
                            var map = renderer.getMap();
                            var afterZoom_state;

                            map.events.register("zoomend", map, function () {
                                afterZoom_state = map.getZoom();
                                // EXPECT: We expect the Present (After) Zoom value to be one greater than Before we emitted Zoom In.
                                expect(afterZoom_state).to.equal(beforeZoom_state + 1);
                                console.log("After: ", map.getZoom());
                                done();
                            });
                            var beforeZoom_state = map.getZoom();
                            // EXPECT: We expect the Initial Zoom value to be 4.
                            expect(beforeZoom_state).to.equal(4);
                            console.log("Before: ", map.getZoom());
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.view.zoom.in',
                                    message: {}
                                }
                            });  // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    var $fixtures = $('#fixtures');
                    meridian.html = $fixtures.html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it
        }); // map.view.zoom
        describe('map.view.zoom.out', function () {

            it("Base Test: Zoom Out (Set zoom level manually, then zoom out by 1)", function (done) {
                this.timeout(5000);
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        if (params.channel == 'map.status.ready') {
                            var map = renderer.getMap();
                            map.setCenter([2, 2], 5);
                            chai.should();
                            var afterZoom_state;

                            map.events.register("zoomend", map, function () {
                                afterZoom_state = map.getZoom();
                                // EXPECT: We expect the Present (After) Zoom value to be one less than Before we emitted Zoom Out.
                                expect(afterZoom_state).to.equal(beforeZoom_state - 1);  // compare of the zoom level here
                                done();
                            });

                            var beforeZoom_state = map.getZoom();
                            // EXPECT: We expect the Zoom State to Equal 5; the number manually set above in map.setCenter.
                            expect(beforeZoom_state).to.equal(5);
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.view.zoom.out',
                                    message: {}
                                }
                            });  // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    var $fixtures = $('#fixtures');
                    meridian.html = $fixtures.html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it

            it("Edge Case: Set zoom level to zero, check zoom level after the channel emit", function (done) {
                this.timeout(5000);
                var passed = true;

                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        if (params.channel == 'map.status.ready') {
                            var map = renderer.getMap();
                            map.setCenter([2, 2], 2);

                            map.events.register("zoomend", map, function () {
                                passed = false;
                            });

                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.view.zoom.out',
                                    message: {}
                                }
                            });

                            setTimeout(function () {
                                // EXPECT: We wait 500ms, then expect passed to not have failed us.
                                // If it failed, zoomend would have registered.
                                // In this case, 2 is the maximum Zoom Out value for our 700x700 setup.
                                // If after we set zoom to 2 via map.setCenter, we try to emit a Zoom Out, it should not register.
                                expect(passed).to.be.equal(true);
                                done();
                            }, 500);
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    var $fixtures = $('#fixtures');
                    meridian.html = $fixtures.html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it
        }); // map.view.zoom.out
        describe('map.view.zoom.max.extent', function () {

            // Capture the Zoom to Max Extent
            it("Base Test: Map Zoom to Max Extent", function (done) {
                this.timeout(5000);
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        if (params.channel == 'map.status.ready') {
                            // map goes first
                            var map = renderer.getMap();
                            var afterZoom_state;
                            map.setCenter(new OpenLayers.LonLat(2.860830, -6.059307), 5);
                            map.events.register("zoomend", map, function(){
                                afterZoom_state = map.getZoom();
                                // EXPECT: We expect that after the emit, our Zoom Level should be BELOW the beforeZoom_state.
                                // NOTE: The MaxExtent number can change depending on the map's size.
                                // In this Mocha test, with a map window of 700x700, we expect the MaxExtent level to be 2.
                                expect(afterZoom_state).to.equal(beforeZoom_state-3);
                                done();
                            });
                            var beforeZoom_state = map.getZoom();
                            // EXPECT: We expect our before Zoom to Match our manually entered data via map.setCenter.
                            expect(beforeZoom_state).to.equal(5);
                            meridian.sandbox.external.receiveMessage({data:{channel:'map.view.zoom.max.extent', message: {} }});  // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    var $fixtures = $('#fixtures');
                    meridian.html = $fixtures.html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it
        }); // map.view.zoom.max.extent
        describe('map.view.center.location', function () {
            it("Base Test: Map Zoom to Center Location (Check coordinates match expected results after channel emit)", function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    console.log('in it', meridian);
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        if (params.channel == 'map.status.ready') {
                            var map = renderer.getMap();
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.view.center.location', message: {
                                        "location": {
                                            "lat": 30,
                                            "lon": 30
                                        }
                                    }
                                }
                            });  // manual publish to the channel
                            var payloadCoords = map.getCenter().transform(map.projection, map.projectionWGS84);
                            console.debug("Post-Emited Raw Coordinates: " + map.getCenter());
                            console.debug("Converted Longitude: " + payloadCoords.lon);
                            console.debug("Converted Latitude: " + payloadCoords.lat);
                            chai.expect(payloadCoords.lon).to.be.above(29.99999999).and.below(30.00000001);
                            chai.expect(payloadCoords.lat).to.be.above(29.99999999).and.below(30.00000001);
                            done();
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    var $fixtures = $('#fixtures');
                    meridian.html = $fixtures.html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it
        });//map.view.center.location
        describe('map.view.center.bounds', function () {
            // Capture the Center Bounds
            it("Base Test: Map Center to Bounds", function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    console.log('in it', meridian);
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        if (params.channel == 'map.status.ready') {
                            // map goes first
                            var map = renderer.getMap();
                            var payload = {
                                "bounds": {
                                    "southWest": {
                                        "lat": 34.5,
                                        "lon": -124
                                    },
                                    "northEast": {
                                        "lat": 50.5,
                                        "lon": -79
                                    }
                                }
                            }
                            expect(payload).to.exist; // payload exists
                            expect(payload).to.be.an('object'); // payload is an object
                            var expectedBounds_values = {  // expected values of the bounds result after map.view.center.bounds emitted
                                bottom: 30.76711104806655,
                                left: -116.88085937499952,
                                right: -86.11914062499609,
                                top: 53.23679754234628
                            }
                            //test goes here
                            //map.setCenter(new OpenLayers.LonLat(38.860830, -77.059307), 5); // setCenter must go here to display the error in the mocha HTML error log
                            map.events.register("moveend", map, function () { // zoomend does not seem to work for this channel emit
                                var actualBounds_values = map.getExtent().transform(map.projection, map.projectionWGS84); // gets the extent and converts back to lat/lon, this value will change if a different projection is used
                                //var actualBounds_values = {  // expected values of the bounds result after map.view.center.bounds emitted
                                //    bottom: null,
                                //    left: -102.20312499999488,
                                //    right: -100.79687499999713,
                                //    top: 43.53004857001649
                                //}
                                expect(actualBounds_values).to.exist;           // actualBounds_values exists
                                console.debug('The actualBounds_values is not null or undefined');
                                expect(actualBounds_values).to.be.an('object'); // actualBounds_values is an object
                                console.debug('The actualBounds_values is an object');
                                expect(actualBounds_values.bottom).to.exist;    // not null or undefined
                                console.debug('The actual bounds object, bottom property exists: ' + actualBounds_values.bottom);
                                expect(actualBounds_values.left).to.exist;      // not null or undefined
                                console.debug('The actual bounds object, left property exists: ' + actualBounds_values.left);
                                expect(actualBounds_values.right).to.exist;    // not null or undefined
                                console.debug('The actual bounds object, right property exists: ' + actualBounds_values.right);
                                expect(actualBounds_values.top).to.exist;    // not null or undefined
                                console.debug('The actual bounds object, top property exists: ' + actualBounds_values.top);
                                expect(expectedBounds_values.bottom).to.equal(actualBounds_values.bottom);
                                console.debug('The actual bounds bottom property is equal to the expected bounds bottom property');
                                expect(expectedBounds_values.left).to.equal(actualBounds_values.left);
                                console.debug('The actual bounds left property is equal to the expected bounds left property');
                                expect(expectedBounds_values.right).to.equal(actualBounds_values.right);
                                console.debug('The actual bounds right property is equal to the expected bounds right property');
                                expect(expectedBounds_values.top).to.equal(actualBounds_values.top);
                                console.debug('The actual bounds top property is equal to the expected bounds top property');
                                done();
                            });
                            //map.setCenter(new OpenLayers.LonLat(38.860830, -77.059307), 5); // setCenter must go here to display the error in the mocha HTML error log
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.view.center.bounds',
                                    message: payload
                                }
                            });  // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    var $fixtures = $('#fixtures');
                    meridian.html = $fixtures.html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it
        }); // map.view.center.bounds


        describe('map.view.center.overlay', function () {
            it("Base Test: Map View Center Overlay", function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    console.log('in it', meridian);
                    console.debug(meridian);
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        if (params.channel == 'map.status.ready') {
                            // map goes first
                            var map = renderer.getMap(),
                                beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
                                afterLayerCreateCount,
                                payload = {
                                    "overlayId": "testOverlayId1",
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
                                                        -10,
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
                                            },
                                            {
                                                "type": "Feature",
                                                "geometry": {
                                                    "type": "Point",
                                                    "coordinates": [
                                                        50,
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
                                            },
                                            {
                                                "type": "Feature",
                                                "geometry": {
                                                    "type": "Point",
                                                    "coordinates": [
                                                        10,
                                                        50
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
                                index,
                                plotSuccess = false;

                            map.setCenter([2, 2], 5);

                            // Verify Layer Creation
                            meridian.sandbox.on('map.layer.create', function (params) {
                                afterLayerCreateCount = map.layers.length;
                                // EXPECT: Where we expect that our layer count has in fact increased.
                                expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                                index = -1;
                                var searchTerm = "testOverlayId1",
                                    mapLayers = map.layers;
                                for (var i = 0, len = mapLayers.length; i < len; i++) {
                                    if (mapLayers[i].layerId === searchTerm) {
                                        index = i;
                                        break;
                                    }
                                }
                            });

                            // Verify Features Plotted
                            meridian.sandbox.on('map.features.plot', function (params) {
                          plotSuccess = true;
                            });

                            // EXPECT: Where we expect the initial Zoom Value and Coordinates to match the values we
                            // have entered further up the code via map.setCenter([2,2], 5). This is to demonstrate
                            // that the upcoming view center overlay emit will alter these values.
                            expect(map.getCenter().lon).to.be.equal(2);
                            expect(map.getCenter().lat).to.be.equal(2);
                            expect(plotSuccess).to.be.equal(true);

                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.feature.plot',
                                    message: payload
                                }
                            });
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.view.center.overlay', message: {
                                        "overlayId": "testOverlayId1"
                                    }
                                }
                            });

                            setTimeout(function () {
                                                    // EXPECT: We wait 500ms, then expect the Zoom and coordinates
                                                    // to have changed properly to a centered point between the
                                                    // features on overlay "testOverlayId1".
                                                    // Note: These values will change depending on the bounds given
                                                    // for our Map frame's width and height in the Mocha Index.html file.
                                                    // We also ensure a plot emit registers to begin with via plotSuccess check.
                                                    expect(map.getZoom()).to.be.equal(4);
                                                    expect((map.getCenter().transform(map.projection, map.projectionWGS84)).lon).to.be.above(19.9998).and.below(20);
                                                    expect((map.getCenter().transform(map.projection, map.projectionWGS84)).lat).to.be.above(32.146700).and.below(32.1468);
                                                    expect(plotSuccess).to.be.equal(true);
                                                }, 500);
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    var $fixtures = $('#fixtures');
                    meridian.html = $fixtures.html;
                    renderer.initialize.call(meridian, meridian);
                    done();
                });
            });//it
        }); // map.view.center.overlay

        describe('map.clear', function () {

            it("Base Test: Map.Clear", function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    console.log('in it', meridian);
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        if (params.channel == 'map.status.ready') {
                            // map goes first
                            var map = renderer.getMap(),
                                beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
                                afterLayerCreateCount,
                                payload = {
                                    "overlayId": "testOverlayId1",
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
                                                        -20,
                                                        20
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
                                            },
                                            {
                                                "type": "Feature",
                                                "geometry": {
                                                    "type": "Point",
                                                    "coordinates": [
                                                        0,
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
                                            },
                                            {
                                                "type": "Feature",
                                                "geometry": {
                                                    "type": "Point",
                                                    "coordinates": [
                                                        10,
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
                                }

                            meridian.sandbox.on('map.layer.create', function (params) {
                                afterLayerCreateCount = map.layers.length;
                                // EXPECT: We expect the Layer count to have increased on layer creation.
                                expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                                index = -1;
                                var searchTerm = "testOverlayId1",
                                    mapLayers = map.layers;
                                for (var i = 0, len = mapLayers.length; i < len; i++) {
                                    if (mapLayers[i].layerId === searchTerm) {
                                        index = i;
                                        break;
                                    }
                                }
                            });
                            meridian.sandbox.on('map.features.plot', function (params) {
                            });

                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.feature.plot',
                                    message: payload
                                }
                            }); // manual publish to the channel


                            // EXPECT: We expect there to be a Feature in the features array at position 0, and further, we pull a coordinate from that Feature's data.
                            expect(map.layers[index]["features"][0]["geometry"]['bounds'].transform(map.projection, map.projectionWGS84)["left"]).to.equal(-20.000000000000398);

                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.clear',
                                    message: {}
                                }
                            }); // manual publish to the channel

                            // EXPECT: After testing the existence of added feature(s) and afterwards call map.clear, we now expect the map.layers Index to no longer exist, and be wiped from the map.clear call. No more Features, no more OverlayID.
                            expect(map.layers[index]).to.not.be.ok;
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    var $fixtures = $('#fixtures');
                    meridian.html = $fixtures.html;
                    renderer.initialize.call(meridian, meridian);
                    done();
                });
            });//it

        });
    });//describe


});



