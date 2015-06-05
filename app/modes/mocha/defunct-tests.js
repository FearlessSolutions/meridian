define([
    'chai',
    'meridian-config',
    'aura/aura',
    'mocha'
], function(chai, configuration, Aura) {
    //start your test here.
    //mocha needs to see describe globally. If you try putting it in a function, it wont excecute. (Unless my test wasn't good.)
    describe('Defunct Channels', function () {
        var exitBeforeEach,
            meridian;

        //Read up on hooks: there might be a way of doing this outside the describe for a cleaner look.
        beforeEach(function (done) {
            exitBeforeEach = done;//Aura.then() function wont have access to done. I store it here and then call it.
            meridian = Aura({
                appName: configuration.appName,
                sources: {default: 'components'},
                mediator: configuration.mediator,
                version: configuration.version,
                releaseDate: configuration.releaseDate,
                cmapiVersion: configuration.cmapiVersion
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
                .use('extensions/snapshot-extension/snapshot-extension')
                .use('extensions/map-configuration-extension/map-configuration-extension')
                .use('extensions/user-settings-extension/user-settings-extension')
                .use('extensions/support-configuration-extension/support-configuration-extension')
                .use('extensions/icon-extension/icon-extension')
                .use('extensions/exports/export-utils/export-utils')
                .use('extensions/cmapi-extension/cmapi-extension')  // added for cmapi
                .start({components: 'body'})
                .then(function () {
                    //start test
                    //must wait until aura starts before doing anything test related.
                    //If not, meridian variable will be undefined.
                    exitBeforeEach();
                });//end of then
        });//end of beforeEach

        describe('map.view.center.data', function () {
            //it("Base Test: Map View Center Data - DEFUNCT", function (done) {
            //
            //});

        });//map.view.center.data

        describe('map.feature.plot.batch', function () {
            //it("Base Test: Feature Plot Batch - DEFUNCT", function (done) {
            //
            //});
            //it("Base Test: Feature Plot Batch - DEFUNCT", function (done) {
            //
            //    // This Unit Test (And Channel) might be irrelevant, as it doesn't seem to provide any real advantages
            //    // over the basic map.feature.plot channel. You can plot multiple points there, and also define the
            //    // same amount of data.
            //
            //    require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
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
        });//map.feature.plot.batch
    });//describe
});
