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
    describe('CMAPI Unit Test Channels', function () {
        var upload, cmapiMain, renderer, exitBeforeEach, meridian;

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

//
//        //
//        //it("Map Zoom to Max Extent Unit Test", function (done) {
//        //    require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
//        //        console.log('in it', meridian);
//        //        meridian.sandbox.external.postMessageToParent = function (params) {
//        //            if (params.channel == 'map.status.ready') {
//        //                // map goes first
//        //                var map = renderer.getMap();
//        //                var afterZoom_state,
//        //                    afterCenter_pos;
//        //                //test goes here
//        //                // map.setCenter moved before the event register because it was logging a message in the console
//        //                map.setCenter(new OpenLayers.LonLat(38.860830, -77.059307), 5);
//        //                map.events.register("zoomend", map, function(){
//        //                    afterZoom_state = map.getZoom();
//        //                    afterCenter_pos = map.getCenter();
//        //                    expect(beforeZoom_state).to.exist;  // payload is neither null nor undefined
//        //                    expect(afterZoom_state).to.exist;  // payload is neither null nor undefined
//        //                    console.debug('This is the zoom level after the emit has been published ' + afterZoom_state);
//        //                    expect(beforeZoom_state).to.not.equal(afterZoom_state);  // compare of the zoom level
//        //                    console.debug('This is the center position after the emit has been published ' + afterCenter_pos);
//        //                    expect(beforeCenter_pos).to.not.equal(afterCenter_pos); // compare of the center position
//        //                    console.debug('The initial zoom level ' + beforeZoom_state + ' is greater than the post-zoom-to-max-extent zoom level ' + afterZoom_state + ', therefore, it correctly zoomed out');
//        //                    expect(beforeZoom_state).to.be.above(afterZoom_state);
//        //                    done();
//        //                });
//        //                //map.setCenter(new OpenLayers.LonLat(38.860830, -77.059307), 5); // setCenter must go here to display
//        //                var beforeZoom_state = map.getZoom();
//        //                var beforeCenter_pos = map.getCenter();
//        //                console.debug('This is the initial map zoom level '+  beforeZoom_state);
//        //                console.debug('This is the initial center position '+  beforeCenter_pos);
//        //                meridian.sandbox.external.receiveMessage({data:{channel:'map.view.zoom.max.extent', message: {} }});  // manual publish to the channel
//        //            }
//        //        };
//        //        //meridian.sandbox.on('map.zoom.in', function(params) { console.log('zoomListen')} );
//        //        cmapiMain.initialize.call(meridian, meridian);
//        //        var $fixtures = $('#fixtures');
//        //        meridian.html = $fixtures.html;
//        //        renderer.initialize.call(meridian, meridian);
//        //    });
//        //});//it
//
//
//
//
//



        // Capture the Zoom-in
        it("Map Zoom-In Unit Test", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap();
                        var afterZoom_state;
                        //test goes here
                        map.events.register("zoomend", map, function(){
                            afterZoom_state = map.getZoom();
                            expect(beforeZoom_state).to.exist;  // payload is neither null nor undefined
                            expect(afterZoom_state).to.exist;  // payload is neither null nor undefined
                            console.debug('This is the zoom level after the emit has been published ' + afterZoom_state);
                            expect(beforeZoom_state).to.not.equal(afterZoom_state);  // compare of the zoom level here
                            console.debug('The initial zoom level ' + beforeZoom_state + ' is less than the post-zoom-in zoom level ' + afterZoom_state + ', therefore, it correctly zoomed in');
                            expect(beforeZoom_state).to.be.below(afterZoom_state);
                            done();
                        });
                        var beforeZoom_state = map.getZoom();
                        console.debug('This is the initial map zoom level '+  beforeZoom_state);
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.view.zoom.in', message: {} }});  // manual publish to the channel
                    }
                };
                //meridian.sandbox.on('map.zoom.in', function(params) { console.log('zoomListen')} );

                cmapiMain.initialize.call(meridian, meridian);
                var $fixtures = $('#fixtures');
                meridian.html = $fixtures.html;
                renderer.initialize.call(meridian, meridian);
            });
        });//it


        //
        //it("Map.Clear Unit Test", function (done) {
        //    require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
        //        console.log('in it', meridian);
        //        meridian.sandbox.external.postMessageToParent = function (params) {
        //            if (params.channel == 'map.status.ready') {
        //                // map goes first
        //                var map = renderer.getMap(),
        //                    beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
        //                    afterLayerCreateCount,
        //                    payload = {
        //                        "overlayId": "testOverlayId1",
        //                        "name": "Test Name 1",
        //                        "format": "geojson",
        //                        "feature": {
        //                            "type": "FeatureCollection",
        //                            "features": [
        //                                {
        //                                    "type": "Feature",
        //                                    "geometry": {
        //                                        "type": "Point",
        //                                        "coordinates": [
        //                                            -20,
        //                                            20
        //                                        ]
        //                                    },
        //                                    "properties": {
        //                                        "p1": "pp1"
        //                                    },
        //                                    "style": {
        //                                        "height": 24,
        //                                        "width": 24,
        //                                        "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
        //                                        "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
        //                                    }
        //                                },
        //                                {
        //                                    "type": "Feature",
        //                                    "geometry": {
        //                                        "type": "Point",
        //                                        "coordinates": [
        //                                            0,
        //                                            10
        //                                        ]
        //                                    },
        //                                    "properties": {
        //                                        "p1": "pp1"
        //                                    },
        //                                    "style": {
        //                                        "height": 24,
        //                                        "width": 24,
        //                                        "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
        //                                        "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
        //                                    }
        //                                },
        //                                {
        //                                    "type": "Feature",
        //                                    "geometry": {
        //                                        "type": "Point",
        //                                        "coordinates": [
        //                                            10,
        //                                            10
        //                                        ]
        //                                    },
        //                                    "properties": {
        //                                        "p1": "pp1"
        //                                    },
        //                                    "style": {
        //                                        "height": 24,
        //                                        "width": 24,
        //                                        "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
        //                                        "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
        //                                    }
        //                                }
        //                            ]
        //                        },
        //                        "zoom": false,
        //                        "readOnly": false
        //                    }
        //
        //                meridian.sandbox.on('map.layer.create', function (params) {
        //                    afterLayerCreateCount = map.layers.length;
        //                    // EXPECT: We expect the Layer count to have increased on layer creation.
        //                    expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
        //                    index = -1;
        //                    var searchTerm = "testOverlayId1",
        //                        mapLayers = map.layers;
        //                    for (var i = 0, len = mapLayers.length; i < len; i++) {
        //                        if (mapLayers[i].layerId === searchTerm) {
        //                            index = i;
        //                            break;
        //                        }
        //                    }
        //                });
        //                meridian.sandbox.on('map.features.plot', function (params) {
        //                });
        //
        //                meridian.sandbox.external.receiveMessage({
        //                    data: {
        //                        channel: 'map.feature.plot',
        //                        message: payload
        //                    }
        //                }); // manual publish to the channel
        //
        //
        //                // EXPECT: We expect there to be a Feature in the features array at position 0, and further, we pull a coordinate from that Feature's data.
        //                expect(map.layers[index]["features"][0]["geometry"]['bounds'].transform(map.projection, map.projectionWGS84)["left"]).to.equal(-20.000000000000398);
        //
        //                meridian.sandbox.external.receiveMessage({
        //                    data: {
        //                        channel: 'map.clear',
        //                        message: {}
        //                    }
        //                }); // manual publish to the channel
        //
        //                // EXPECT: After testing the existence of added feature(s) and afterwards call map.clear, we now expect the map.layers Index to no longer exist, and be wiped from the map.clear call. No more Features, no more OverlayID.
        //                expect(map.layers[index]).to.not.be.ok;
        //            }
        //        };
        //        cmapiMain.initialize.call(meridian, meridian);
        //        var $fixtures = $('#fixtures');
        //        meridian.html = $fixtures.html;
        //        renderer.initialize.call(meridian, meridian);
        //        done();
        //    });
        //});//it
        //
















        //
        //
        //
        //it("Feature Plot Unit Test", function (done) {
        //    require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
        //        console.log('in it', meridian);
        //        console.debug(meridian);
        //        meridian.sandbox.external.postMessageToParent = function (params) {
        //            if (params.channel == 'map.status.ready') {
        //                // map goes first
        //
        //
        //                var map = renderer.getMap(),
        //                    beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
        //                    afterLayerCreateCount,
        //                    payload = {
        //                        "overlayId": "testOverlayId1",
        //                        "name": "Test Name 1",
        //                        "format": "geojson",
        //                        "feature": {
        //                            "type": "FeatureCollection",
        //                            "features": [
        //                                {
        //                                    "type": "Feature",
        //                                    "geometry": {
        //                                        "type": "Point",
        //                                        "coordinates": [
        //                                            -20,
        //                                            20
        //                                        ]
        //                                    },
        //                                    "properties": {
        //                                        "p1": "pp1"
        //                                    },
        //                                    "style": {
        //                                        "height": 24,
        //                                        "width": 24,
        //                                        "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
        //                                        "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
        //                                    }
        //                                },
        //                                {
        //                                    "type": "Feature",
        //                                    "geometry": {
        //                                        "type": "Point",
        //                                        "coordinates": [
        //                                            0,
        //                                            10
        //                                        ]
        //                                    },
        //                                    "properties": {
        //                                        "p1": "pp1"
        //                                    },
        //                                    "style": {
        //                                        "height": 24,
        //                                        "width": 24,
        //                                        "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
        //                                        "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
        //                                    }
        //                                },
        //                                {
        //                                    "type": "Feature",
        //                                    "geometry": {
        //                                        "type": "Point",
        //                                        "coordinates": [
        //                                            10,
        //                                            10
        //                                        ]
        //                                    },
        //                                    "properties": {
        //                                        "p1": "pp1"
        //                                    },
        //                                    "style": {
        //                                        "height": 24,
        //                                        "width": 24,
        //                                        "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
        //                                        "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
        //                                    }
        //                                }
        //                            ]
        //                        },
        //                        "zoom": false,
        //                        "readOnly": false
        //                    },
        //                //payload = {
        //                //    "overlayId": "testOverlayId1",
        //                //    "name": "Test Name 1",
        //                //    "format": "geojson",
        //                //    "feature": {
        //                //        "type": "FeatureCollection",
        //                //        "features": [
        //                //            {
        //                //                "type": "Feature",
        //                //                "geometry": {
        //                //                    "type": "Point",
        //                //                    "coordinates": [
        //                //                        0,
        //                //                        10
        //                //                        ]
        //                //                    },
        //                //                "properties": {
        //                //                    "p1": "pp1"
        //                //                    },
        //                //                "style": {
        //                //                    "height": 24,
        //                //                    "width": 24,
        //                //                    "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
        //                //                    "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
        //                //                    }
        //                //                }
        //                //            ]
        //                //        },
        //                //    "zoom": false,
        //                //    "readOnly": false
        //                //    },
        //                    index;
        //
        //                //// Payload Iterator. Builds three Payloads in an array with Lon of 0/10/20 and Test Name 1/2/3.
        //                //var payload = [];
        //                //for (var i=0; i<3; i++){
        //                //    payload[i] = {
        //                //        "overlayId": "testOverlayId1"/*+ (i+1)*/,
        //                //        "name": "Test Name " + (i+1),
        //                //        "format": "geojson",
        //                //        "feature": {
        //                //            "type": "FeatureCollection",
        //                //            "features": [
        //                //                {
        //                //                   // "featureId": ("f"+(i+1)),
        //                //                    "type": "Feature",
        //                //                    "geometry": {
        //                //                        "type": "Point",
        //                //                        "coordinates": [
        //                //                        //    (10+((i-1)*10)),
        //                //                            (i*10),
        //                //                            10
        //                //                        ]
        //                //                        //"coordinates": [
        //                //                        //    10,
        //                //                        //    10
        //                //                        //]
        //                //                    },
        //                //                    "properties": {
        //                //                        "p1": "pp1"
        //                //                    },
        //                //                    "style": {
        //                //                        "height": 24,
        //                //                        "width": 24,
        //                //                        "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
        //                //                        "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
        //                //                    }
        //                //                }
        //                //            ]
        //                //        },
        //                //        "zoom": false,
        //                //        "readOnly": false
        //                //    };
        //                //}
        //                //
        //                //console.debug("Payload! ", payload[0].name, ", ", payload[0].feature.features[0].geometry.coordinates);
        //                //console.debug("Payload! ", payload[1].name, ", ", payload[1].feature.features[0].geometry.coordinates);
        //                //console.debug("Payload! ", payload[2].name, ", ", payload[2].feature.features[0].geometry.coordinates);
        //
        //
        //                //test goes here
        //
        //                meridian.sandbox.on('map.layer.create', function (params) {
        //                    afterLayerCreateCount = map.layers.length;
        //
        //                    expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
        //                    index = -1;
        //                    var searchTerm = "testOverlayId1",
        //                        mapLayers = map.layers;
        //                    for (var i = 0, len = mapLayers.length; i < len; i++) {
        //                        if (mapLayers[i].layerId === searchTerm) {
        //                            index = i;
        //                            break;
        //                        }
        //                    }
        //
        //                    //expect(index).to.not.equal(-1); // confirms map.feature.plot added a layer and one with the overlayId, 'testOverlayId1'
        //                    //console.debug('Layer exists, create layer successful');
        //                    ////console.log("Test Overlay ID 1! ", testOverlayId1);
        //                    //console.debug(meridian);
        //                });
        //                meridian.sandbox.on('map.features.plot', function (params) {
        //                    //console.debug(map.layers[index]);
        //                    // var test1 = map.layers[index]["features"][0]["geometry"]["bounds"];
        //                    var testA = map.layers[index]["features"][0]["geometry"]["bounds"].transform(map.projection, map.projectionWGS84);
        //                    var actualLat = testA["left"];
        //                    var actualLon = testA["top"];
        //                    console.debug("Map: ", map.layers[index]);
        //                    //    console.debug ("Test1! ", test1);
        //                    console.debug("actualLat! ", actualLat);
        //                    console.debug("actualLon! ", actualLon);
        //                    //console.log ("GetBounds: ", map.layers[index]["features"][0]["geometry"].getBounds());
        //                    //  console.log ("GetBounds: ", map.layers[index]["features"][0].cluster[2]["geometry"].getBounds());
        //                    console.log("Data Extent: ", map.layers[index].getDataExtent());
        //                    //console.log(testOverlayId1.features[0].geometry.getVertices()[0] );
        //                    // console.log(map.getCenter().transform(map.projection, map.projectionWGS84));
        //
        //                    //console.debug(map.layers[index]["features"][0]["geometry"]["bounds"].transform(map.projection, map.projectionWGS84));
        //                });
        //                //  meridian.sandbox.external.receiveMessage({data:{channel:'map.feature.plot', message: payload[0] }}); // manual publish to the channel
        //                //  meridian.sandbox.external.receiveMessage({data:{channel:'map.feature.plot', message: payload[1] }}); // manual publish to the channel
        //
        //
        //                map.events.register("zoomend", map, function () {
        //                    console.log("WE DID IT!");
        //                    afterZoom_state = map.getZoom();
        //                    afterCenter_pos = map.getCenter();
        //                    console.debug('This is the zoom level after the emit has been published ' + afterZoom_state);
        //                    console.debug('This is the center position after the emit has been published ' + afterCenter_pos);
        //                    expect(map.afterZoom_state).to.equal(5);
        //                    //afterZoom_state = map.getZoom();
        //                    //afterCenter_pos = map.getCenter();
        //                    //expect(beforeZoom_state).to.exist;  // payload is neither null nor undefined
        //                    //expect(afterZoom_state).to.exist;  // payload is neither null nor undefined
        //                    //console.debug('This is the zoom level after the emit has been published ' + afterZoom_state);
        //                    //expect(beforeZoom_state).to.not.equal(afterZoom_state);  // compare of the zoom level
        //                    //console.debug('This is the center position after the emit has been published ' + afterCenter_pos);
        //                    //expect(beforeCenter_pos).to.not.equal(afterCenter_pos); // compare of the center position
        //                    //console.debug('The initial zoom level ' + beforeZoom_state + ' is greater than the post-zoom-to-max-extent zoom level ' + afterZoom_state + ', therefore, it correctly zoomed out');
        //                    //expect(beforeZoom_state).to.be.above(afterZoom_state);
        //                    done();
        //                });
        //
        //
        //                var beforeZoom_state = map.getZoom();
        //                var beforeCenter_pos = map.getCenter();
        //                console.debug('This is the initial map zoom level ' + beforeZoom_state);
        //                console.debug('This is the initial center position ' + beforeCenter_pos);
        //                console.log("prepub");
        //                meridian.sandbox.external.receiveMessage({
        //                    data: {
        //                        channel: 'map.feature.plot',
        //                        message: payload
        //                    }
        //                }); // manual publish to the channel
        //                console.log("postpub");
        //                meridian.sandbox.external.receiveMessage({
        //                    data: {
        //                        channel: 'map.view.center.overlay', message: {
        //                            "overlayId": "testOverlayId1"
        //                        }
        //                    }
        //                });  // manual publish to the channel
        //
        //            }
        //        };
        //        cmapiMain.initialize.call(meridian, meridian);
        //        var $fixtures = $('#fixtures');
        //        meridian.html = $fixtures.html;
        //        renderer.initialize.call(meridian, meridian);
        //        done();
        //    });
        //});//it

    });//describe
});

