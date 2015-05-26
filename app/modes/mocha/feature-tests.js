define([
    'chai',
    'meridian-config',
    'aura/aura',
    'mocha'
], function(chai, configuration, Aura) {
    var expect = chai.expect;

    //start your test here.
    //mocha needs to see describe globally. If you try putting it in a function, it wont excecute. (Unless my test wasn't good.)
    describe('Feature Channels', function () {
        var exitBeforeEach,
            meridian;

        //Read up on hooks: there might be a way of doing this outside the describe for a cleaner look.
        beforeEach(function (done) {
            exitBeforeEach = done;//Aura.then() function wont have access to done. I store it here and then call it.
            meridian = Aura({
                debug: true,
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
                    exitBeforeEach();
                });//end of then
        });//end of beforeEach
        describe('map.feature.plot', function () {
            // Capture Feature Plot
            it('Base Test: Feature Plot (coordinates, p1, style)', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        var map,
                            payload,
                            i,
                            len,
                            beforeLayerCreateCount,
                            afterLayerCreateCount,
                            index;

                        if (params.channel == 'map.status.ready') {
                            map = renderer.getMap();
                            payload = {
                                overlayId: 'testOverlayId1',
                                name: 'Test Name 1',
                                format: 'geojson',
                                feature: {
                                    type: 'FeatureCollection',
                                    features: [
                                        {
                                            type: 'Feature',
                                            geometry: {
                                                type: 'Point',
                                                coordinates: [
                                                    -5,
                                                    10
                                                ]
                                            },
                                            properties: {
                                                featureId:'featureId01_',
                                                p1: 'pp1'
                                            },
                                            style: {
                                                height: 24,
                                                width: 24,
                                                icon: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png',
                                                iconLarge: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png'
                                            }
                                        }
                                    ]
                                },
                                zoom: false,
                                readOnly: false
                            };
                            beforeLayerCreateCount = map.layers.length; // layer count prior to the channel emit
                            meridian.sandbox.on('map.layer.create', function (params) {
                                afterLayerCreateCount = map.layers.length;
                                // EXPECT: We expect the Layer count to have increased on layer creation.
                                expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                                index = -1;
                                for (i = 0, len = map.layers.length; i < len; i++) {
                                    if (map.layers[i].layerId === 'testOverlayId1') {
                                        index = i;
                                        break;
                                    }
                                }
                            });

                            meridian.sandbox.on('map.features.plot', function (params) {
                                var plottedFeature = map.layers[index]['features'][0], // confirm featureId exists / despite not in payload
                                    convertedCoords = map.layers[index]['features'][0]['geometry']['bounds'].transform(map.projection, map.projectionWGS84),
                                    actualLat = convertedCoords['left'],
                                    actualLon = convertedCoords['top'],
                                    actualp1 = plottedFeature['attributes']['p1'],
                                    actualSH = plottedFeature['attributes']['height'],
                                    actualSW = plottedFeature['attributes']['width'],
                                    actualSI = plottedFeature['attributes']['icon'];

                                expect(map.layers[index]['features'].length).is.above(0); // confirm feature added to layer
                                expect('featureId' in plottedFeature).is.true; // expected payload Lat is -5, actual Lat should be somewhat close (factoring in mathematical conversion)
                                expect(actualLat).to.be.below(-4.999999999).and.above(-5.000000001); // expected payload Lon is 10, actual Lat should be somewhat close (factoring in mathematical conversion)
                                expect(actualLon).to.be.above(9.999999999).and.below(10.000000001);
                                expect(actualp1).to.equal(payload.feature.features[0].properties.p1);
                                expect(actualSH).to.equal(payload.feature.features[0].style.height);
                                expect(actualSW).to.equal(payload.feature.features[0].style.width);
                                expect(actualSI).to.equal(payload.feature.features[0].style.icon);
                                console.debug
                                done();
                            });
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.feature.plot',
                                    message: payload
                                }
                            }); // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    meridian.html = $('#fixtures').html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it
            it('Base Test: Feature Plot (featureId)', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        var map,
                            payload,
                            i,
                            len,
                            beforeLayerCreateCount,
                            afterLayerCreateCount,
                            index;
                        if (params.channel == 'map.status.ready') {
                            map = renderer.getMap();
                            payload = {
                                overlayId: 'testOverlayId1',
                                name: 'Test Name 1',
                                format: 'geojson',
                                feature: {
                                    type: 'FeatureCollection',
                                    features: [
                                        {
                                            type: 'Feature',
                                            geometry: {
                                                type: 'Point',
                                                coordinates: [
                                                    -5,
                                                    10
                                                ]
                                            },
                                            properties: {
                                                featureId: 'featureIdtest_',
                                                p1: 'pp1'
                                            },
                                            style: {
                                                height: 24,
                                                width: 24,
                                                icon: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png',
                                                iconLarge: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png'
                                            }
                                        }
                                    ]
                                },
                                zoom: false,
                                readOnly: false
                            };
                            beforeLayerCreateCount = map.layers.length; // layer count prior to the channel emit
                            meridian.sandbox.on('map.layer.create', function (params) {
                                afterLayerCreateCount = map.layers.length;
                                // EXPECT: We expect the Layer count to have increased on layer creation.
                                expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                                index = -1;
                                for (i = 0, len = map.layers.length; i < len; i++) {
                                    if (map.layers[i].layerId === 'testOverlayId1') {
                                        index = i;
                                        break;
                                    }
                                }
                            });
                            meridian.sandbox.on('map.features.plot', function (params) {
                                expect(map.layers[index]['features'].length).is.above(0); // confirm feature added to layer
                                expect('featureId' in map.layers[index]['features'][0]).is.true; // Expect featureId in plotted feature is true.
                                // application use of feature id (location @ featureIdtest_) is not the same as CMAPI spec
                                expect(payload.feature.features[0].properties.featureId + meridian.sandbox.sessionId).to.equal(map.layers[index].features[0].featureId);
                                console.debug(map);
                                done();
                            });
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.feature.plot',
                                    message: payload
                                }
                            }); // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    meridian.html = $('#fixtures').html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it
            //it('Edge case: Feature Plot (no featureId, sessionId string check)', function (done) {
            //    require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
            //        meridian.sandbox.external.postMessageToParent = function (params) {
            //            var map,
            //                payload,
            //                i,
            //                len,
            //                beforeLayerCreateCount,
            //                afterLayerCreateCount,
            //                index;
            //            if (params.channel == 'map.status.ready') {
            //                map = renderer.getMap();
            //                payload = {
            //                    overlayId: 'testOverlayId1',
            //                    name: 'Test Name 1',
            //                    format: 'geojson',
            //                    feature: {
            //                        type: 'FeatureCollection',
            //                        features: [
            //                            {
            //                                type: 'Feature',
            //                                geometry: {
            //                                    type: 'Point',
            //                                    coordinates: [
            //                                        -5,
            //                                        10
            //                                    ]
            //                                },
            //                                properties: {
            //                                    p1: 'pp1'
            //                                },
            //                                style: {
            //                                    height: 24,
            //                                    width: 24,
            //                                    icon: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png',
            //                                    iconLarge: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png'
            //                                }
            //                            }
            //                        ]
            //                    },
            //                    zoom: false,
            //                    readOnly: false
            //                };
            //                beforeLayerCreateCount = map.layers.length; // layer count prior to the channel emit
            //                meridian.sandbox.on('map.layer.create', function (params) {
            //                    afterLayerCreateCount = map.layers.length;
            //                    // EXPECT: We expect the Layer count to have increased on layer creation.
            //                    expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
            //                    index = -1;
            //                    for (i = 0, len = map.layers.length; i < len; i++) {
            //                        if (map.layers[i].layerId === 'testOverlayId1') {
            //                            index = i;
            //                            break;
            //                        }
            //                    }
            //                });
            //                meridian.sandbox.on('map.features.plot', function (params) {
            //                    expect(map.layers[index]['features'].length).is.above(0); // confirm feature added to layer
            //                    expect('featureId' in map.layers[index]['features'][0]).is.true; // Expect featureId in plotted feature is true.
            //                    //expect(map.layers[index].features[0].featureId).to.have.string(meridian.sandbox.sessionId); // checks the generated featureId to contain at least the sessionId
            //                    done();
            //                });
            //                meridian.sandbox.external.receiveMessage({
            //                    data: {
            //                        channel: 'map.feature.plot',
            //                        message: payload
            //                    }
            //                }); // manual publish to the channel
            //            }
            //        };
            //        cmapiMain.initialize.call(meridian, meridian);
            //        meridian.html = $('#fixtures').html;
            //        renderer.initialize.call(meridian, meridian);
            //    });
            //});//it
            //it('Edge case: Feature Plot (Feature in layer created prior to plot emit)', function (done) {
            //    require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
            //        meridian.sandbox.external.postMessageToParent = function (params) {
            //            var map,
            //                payload,
            //                payload2,
            //                actualLayer,
            //                beforeLayerCreateCount,
            //                afterLayerCreateCount,
            //                confirmPlot;
            //            if (params.channel == 'map.status.ready') {
            //                map = renderer.getMap();
            //                payload = {
            //                    overlayId: 'layerCreatedBeforePlotEmit1'
            //                };
            //                payload2 = {
            //                    overlayId: 'layerCreatedBeforePlotEmit1',
            //                    name: 'Test Name 1',
            //                    format: 'geojson',
            //                    feature: {
            //                        type: 'FeatureCollection',
            //                        features: [
            //                            {
            //                                type: 'Feature',
            //                                geometry: {
            //                                    type: 'Point',
            //                                    coordinates: [
            //                                        -5,
            //                                        10
            //                                    ]
            //                                },
            //                                properties: {
            //                                    p1: 'pp1'
            //                                },
            //                                style: {
            //                                    height: 24,
            //                                    width: 24,
            //                                    icon: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png',
            //                                    iconLarge: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png'
            //                                }
            //                            }
            //                        ]
            //                    },
            //                    zoom: false,
            //                    readOnly: false
            //                };
            //                beforeLayerCreateCount = map.layers.length; // layer count prior to the channel emit
            //                meridian.sandbox.on('map.layer.create', function (params) {
            //                    afterLayerCreateCount = map.layers.length;
            //                    expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount); // confirmation that a layer was created
            //                    actualLayer = map.layers[map.layers.length - 1];
            //                    expect(actualLayer).to.exist;
            //                    expect(actualLayer.layerId).to.equal(payload.overlayId);  // actual layerId should equal the payload overlayId
            //                    meridian.sandbox.external.receiveMessage({
            //                        data: {
            //                            channel: 'map.feature.plot',
            //                            message: payload2
            //                        }
            //                    }); // manual publish to the channel
            //                });
            //                meridian.sandbox.on('map.features.plot', function (params) {
            //                    confirmPlot = map.layers[map.layers.length - 1];
            //                    expect(confirmPlot['features'].length).is.above(0); // confirm feature added to layer
            //                    done();
            //                });
            //                meridian.sandbox.external.receiveMessage({
            //                    data: {
            //                        channel: 'map.overlay.create',
            //                        message: payload
            //                    }
            //                }); // manual publish to the channel
            //            }
            //        };
            //        cmapiMain.initialize.call(meridian, meridian);
            //        meridian.html = $('#fixtures').html;
            //        renderer.initialize.call(meridian, meridian);
            //    });
            //});//it
            //it('Edge case: Feature Plot (Feature exists in default layer when layerId is not declared in the payload)', function (done) {
            //    require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
            //        meridian.sandbox.external.postMessageToParent = function (params) {
            //            if (params.channel == 'map.status.ready') {
            //                var map = renderer.getMap(),
            //                    payload,
            //                    actualLayer,
            //                    confirmPlot,
            //                    beforeLayerCreateCount,
            //                    afterLayerCreateCount;
            //
            //                payload = {
            //                    overlayId: '',
            //                    name: 'Test Name 1',
            //                    format: 'geojson',
            //                    feature: {
            //                        type: 'FeatureCollection',
            //                        features: [
            //                            {
            //                                id: 'testFeatureId09',
            //                                type: 'Feature',
            //                                geometry: {
            //                                    type: 'Point',
            //                                    coordinates: [
            //                                        -5,
            //                                        10
            //                                    ]
            //                                },
            //                                properties: {
            //                                    p1: 'pp1'
            //                                },
            //                                style: {
            //                                    height: 24,
            //                                    width: 24,
            //                                    icon: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png',
            //                                    iconLarge: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png'
            //                                }
            //                            }
            //                        ]
            //                    },
            //                    zoom: false,
            //                    readOnly: false
            //                };
            //                beforeLayerCreateCount = map.layers.length; // layer count prior to the channel emit
            //                meridian.sandbox.on('map.layer.create', function (params) {
            //                    afterLayerCreateCount = map.layers.length;
            //                    expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount); // confirmation that a layer was created
            //                    actualLayer = map.layers[map.layers.length - 1];
            //                    expect(actualLayer).to.exist;
            //                    expect(actualLayer.layerId).to.equal('cmapi');  // actual layerId should equal the default layerId, 'cmapi'
            //                });
            //                meridian.sandbox.on('map.features.plot', function (params) {
            //                    confirmPlot = map.layers[map.layers.length - 1];  // grab layer that has cmapi layerId
            //                    expect(confirmPlot['features'][0]['featureId']).to.equal(payload.feature.features[0].id); // confirm feature added to default layer
            //                    done();
            //                });
            //                meridian.sandbox.external.receiveMessage({
            //                    data: {
            //                        channel: 'map.feature.plot',
            //                        message: payload
            //                    }
            //                }); // manual publish to the channel
            //            }
            //        };
            //        cmapiMain.initialize.call(meridian, meridian);
            //        meridian.html = $('#fixtures').html;
            //        renderer.initialize.call(meridian, meridian);
            //    });
            //});//it

        });//map.feature.plot
    });//describe
});

