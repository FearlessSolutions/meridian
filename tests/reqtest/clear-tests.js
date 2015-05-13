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
    describe('Clear Channels', function () {
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

        describe('map.clear', function () {
            it("Base Test: Clear map data", function (done) {
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
        });//map.clear
    });//describe
});

