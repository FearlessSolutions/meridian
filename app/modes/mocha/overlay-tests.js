define([
    'chai',
    'meridian-config',
    'aura/aura',
    'mocha'
], function(chai, configuration, Aura) {
    var expect = chai.expect;

    //start your test here.
    //mocha needs to see describe globally. If you try putting it in a function, it wont excecute. (Unless my test wasn't good.)
    describe('Overlay Channels', function () {
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
                    //start test
                    //must wait until aura starts before doing anything test related.
                    //If not, meridian variable will be undefined.
                    exitBeforeEach();
                });//end of then
        });//end of beforeEach

        describe('map.overlay.create', function () {
            // Capture the Create Layer
            it('Base Test: Create a Layer (with overlayId)', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        var map,
                            payload,
                            beforeLayerCount,
                            afterLayerCount,
                            actualLayer;
                        if (params.channel == 'map.status.ready') {
                            map = renderer.getMap();
                            payload = {
                                name: 'Test Name 1',  // can't check name, because it isn't saved in OL
                                overlayId: 'basetestCreateLayer',
                                coords: {
                                    minLat: '7.602108',
                                    minLon: '-13.908691',
                                    maxLat: '11.587669',
                                    maxLon: '-8.283691'
                                }
                            };
                            beforeLayerCount = map.layers.length; // layer count prior to the channel emit
                            map.events.register('addlayer', map, function () {
                                afterLayerCount = map.layers.length; // layer count prior to the channel emit
                                expect(afterLayerCount).to.be.above(beforeLayerCount); // confirmation that a layer was created
                                actualLayer = map.getLayersBy('layerId', 'basetestCreateLayer' + meridian.sandbox.sessionId)[0];
                                expect(actualLayer.layerId).to.equal(payload.overlayId + meridian.sandbox.sessionId);  // actual layerId should equal the payload overlayId
                                done();
                            });
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.overlay.create',
                                    message: payload
                                }
                            });  // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    meridian.html = $('#fixtures').html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it

            it('Edge case: Create a Layer (without overlayId)', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        var map,
                            payload,
                            beforeLayerCount,
                            afterLayerCount,
                            actualLayer;

                        if (params.channel == 'map.status.ready') {
                            map = renderer.getMap();
                            payload = {
                                name: 'Test Name 1',  // can't check name, because it isn't saved in OL
                                overlayId: '',
                                coords: {
                                    minLat: '7.602108',
                                    minLon: '-13.908691',
                                    maxLat: '11.587669',
                                    maxLon: '-8.283691'
                                }
                            };
                            beforeLayerCount = map.layers.length; // layer count prior to the channel emit
                            map.events.register('addlayer', map, function () {
                                afterLayerCount = map.layers.length; // layer count prior to the channel emit
                                expect(afterLayerCount).to.be.above(beforeLayerCount); // confirmation that a layer was created
                                actualLayer = map.getLayersBy('layerId', 'cmapi' + meridian.sandbox.sessionId)[0]; // the defaultlayerId when payload overlaydId does not exist
                                expect(actualLayer.layerId).to.equal('cmapi' + meridian.sandbox.sessionId);  // cmapi is the defaultLayerId assigned by cmapi when value is empty
                                done();
                            });
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.overlay.create',
                                    message: payload
                                }
                            });  // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    meridian.html = $('#fixtures').html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it

            it('Edge case: Create a Layer (without coordinates)', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        var map,
                            payload,
                            beforeLayerCount,
                            afterLayerCount,
                            actualLayer;

                        if (params.channel == 'map.status.ready') {
                            map = renderer.getMap();
                            payload = {
                                name: 'Test Name 1',  // can't check name, because it isn't saved in OL
                                overlayId: 'edgecaseCreateLayer_nocoords'
                            };
                            beforeLayerCount = map.layers.length; // layer count prior to the channel emit

                            map.events.register('addlayer', map, function () {
                                afterLayerCount = map.layers.length; // layer count prior to the channel emit
                                expect(afterLayerCount).to.be.above(beforeLayerCount); // confirmation that a layer was created
                                actualLayer = map.getLayersBy('layerId', 'edgecaseCreateLayer_nocoords' + meridian.sandbox.sessionId)[0];
                                expect(actualLayer.layerId).to.equal(payload.overlayId + meridian.sandbox.sessionId);  // actual layerId should equal the payload overlayId
                                done();
                            });
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.overlay.create',
                                    message: payload
                                }
                            });  // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    meridian.html = $('#fixtures').html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it
        }); // map.layer.create group

        describe('map.overlay.remove', function () {
            //Capture Remove Layer
            it('Base Test: Remove a Layer', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        var map,
                            payload,
                            beforeLayerCreateCount,
                            afterLayerCreateCount,
                            afterLayerRemoveCount,
                            index,
                            i,
                            len;

                        if (params.channel == 'map.status.ready') {
                            map = renderer.getMap();
                            payload = {
                                overlayId: 'basetestRemoveLayer'
                            };
                            beforeLayerCreateCount = map.layers.length; // layer count prior to the channel emit
                            function layerCheck(layerExists) {
                                index = -1;

                                for (i = 0, len = map.layers.length; i < len; i++) {
                                    if (map.layers[i].layerId === 'basetestRemoveLayer' + meridian.sandbox.sessionId) {
                                        index = i;
                                        break;
                                    }
                                }
                                if (layerExists) {
                                    expect(index).to.not.equal(-1);
                                } else {
                                    expect(index).to.equal(-1); // confirm that no layers contain layerId of testOverlayId1
                                }
                            }
                            meridian.sandbox.on('map.layer.create', function (params) {
                                afterLayerCreateCount = map.layers.length;
                                expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                                expect(map.getLayersBy('layerId', 'basetestRemoveLayer' + meridian.sandbox.sessionId)[0].layerId).to.equal(payload.overlayId + meridian.sandbox.sessionId); // confirms that Id is the overlayId value from the payload
                                layerCheck(true, map.layers);
                            });
                            meridian.sandbox.on('map.layer.delete', function (params) {
                                afterLayerRemoveCount = map.layers.length;
                                expect(afterLayerCreateCount).to.be.above(afterLayerRemoveCount);  // confirms the layer with overlayId value from payload was removed
                                layerCheck(false, map.layers);
                            });
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.overlay.create',
                                    message: payload
                                }
                            }); // manual publish to the channel
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.overlay.remove',
                                    message: payload
                                }
                            }); // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    meridian.html = $('#fixtures').html;
                    renderer.initialize.call(meridian, meridian);
                    done();
                });
            });//it

            it('Edge case: Remove a Layer (multiple layer added)', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        var map,
                            payload,
                            beforeLayerCreateCount,
                            afterLayerCreateCount,
                            afterLayerRemoveCount,
                            anotherLayer,
                            index,
                            i,
                            len;
                        if (params.channel == 'map.status.ready') {
                            map = renderer.getMap();
                            payload = {
                                overlayId: 'edgecaseRemoveLayer_multiplelayeradded'
                            };
                            beforeLayerCreateCount = map.layers.length; // layer count prior to the channel emit
                            function layerCheck(layerExists, params) {
                                index = -1;
                                for (i = 0, len = map.layers.length; i < len; i++) {
                                    if (map.layers[i].layerId === 'edgecaseRemoveLayer_multiplelayeradded' + meridian.sandbox.sessionId) {
                                        index = i;
                                        break;
                                    }
                                }
                                if (layerExists) {
                                    expect(index).to.not.equal(-1);
                                } else {
                                    expect(index).to.equal(-1); // confirm that no layers contain layerId of testOverlayId1
                                }
                            }
                            meridian.sandbox.on('map.layer.create', function (params) {
                                anotherLayer = new OpenLayers.Layer.Vector('OpenLayers Vector', {layerId: 'testOverlayId2'});
                                map.addLayer(anotherLayer);
                                afterLayerCreateCount = map.layers.length;
                                expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                                layerCheck(true, map.layers);
                            });
                            meridian.sandbox.on('map.layer.delete', function (params) {
                                afterLayerRemoveCount = map.layers.length;
                                expect(afterLayerCreateCount).to.be.above(afterLayerRemoveCount);  // confirms the layer with overlayId value from payload was removed
                                layerCheck(false, map.layers);
                            });
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.overlay.create',
                                    message: payload
                                }
                            }); // manual publish to the channel
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.overlay.remove',
                                    message: payload
                                }
                            }); // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    meridian.html = $('#fixtures').html;
                    renderer.initialize.call(meridian, meridian);
                    done();
                });
            });//it
        }); // map.overlay.remove

        describe('map.overlay.hide', function () {
            // Capture Hide Layer
            it('Base Test: Hide Layer', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        var map,
                            payload,
                            beforeLayerCreateCount,
                            afterLayerCreateCount,
                            targetLayer;
                        if (params.channel == 'map.status.ready') {
                            map = renderer.getMap();
                            payload = {
                                overlayId: 'baseTestHideLayer'
                            };
                            beforeLayerCreateCount = map.layers.length; // layer count prior to the channel emit
                            meridian.sandbox.on('map.layer.create', function (params) {
                                afterLayerCreateCount = map.layers.length;
                                expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                                targetLayer = map.getLayersBy('layerId', 'baseTestHideLayer' + meridian.sandbox.sessionId)[0];
                                expect(targetLayer.layerId).to.equal(payload.overlayId + meridian.sandbox.sessionId); // confirms that Id is the overlayId value from the payload
                                expect(targetLayer.getVisibility()).to.be.true; // confirms that the layer baseTestHideLayer is visible
                                meridian.sandbox.external.receiveMessage({
                                    data: {
                                        channel: 'map.overlay.hide',
                                        message: payload
                                    }
                                });
                                expect(targetLayer.getVisibility()).to.be.false; // confirms that the layer baseTestHideLayer is not visible
                                done();
                            });
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.overlay.create',
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

            it('Edge case: Hide Layer (multiple layers added)', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        var map,
                            payload,
                            beforeLayerCreateCount,
                            afterLayerCreateCount,
                            targetLayer,
                            anotherLayer;
                        if (params.channel == 'map.status.ready') {
                            map = renderer.getMap();
                            payload = {
                                overlayId: 'edgecaseHideLayer_multiplelayeradded'
                            };
                            beforeLayerCreateCount = map.layers.length; // layer count prior to the channel emit
                            meridian.sandbox.on('map.layer.create', function (params) {
                                anotherLayer = new OpenLayers.Layer.Vector('OpenLayers Vector', {layerId: 'testOverlayId2'});
                                map.addLayer(anotherLayer);
                                afterLayerCreateCount = map.layers.length;
                                expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                                targetLayer = map.getLayersBy('layerId', 'edgecaseHideLayer_multiplelayeradded' + meridian.sandbox.sessionId)[0];
                                expect(targetLayer.layerId).to.equal(payload.overlayId + meridian.sandbox.sessionId); // confirms that Id is the overlayId value from the payload
                                expect(targetLayer.getVisibility()).to.be.true; // confirms that the layer edgecaseHideLayer_multiplelayeradded is visible
                                meridian.sandbox.external.receiveMessage({
                                    data: {
                                        channel: 'map.overlay.hide',
                                        message: payload
                                    }
                                });
                                expect(targetLayer.getVisibility()).to.be.false; // confirms that the layer edgecaseHideLayer_multiplelayeradded is not visible
                                expect(anotherLayer.getVisibility()).to.be.true; // confirms that the layer testOverlayId2 is visible after the emit
                                done();
                            });
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.overlay.create',
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
        }); // map.overlay.hide
        describe('map.overlay.show', function () {
            // Capture Show Layer
            it('Base Test: Show Layer', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        var map,
                            payload,
                            beforeLayerCreateCount,
                            afterLayerCreateCount,
                            targetLayer;
                        if (params.channel == 'map.status.ready') {
                            map = renderer.getMap();
                            payload = {
                                overlayId: 'basetestShowLayer'
                            };
                            beforeLayerCreateCount = map.layers.length; // layer count prior to the channel emit

                            meridian.sandbox.on('map.layer.create', function (params) {
                                afterLayerCreateCount = map.layers.length;
                                expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                                targetLayer = map.getLayersBy('layerId', 'basetestShowLayer' + meridian.sandbox.sessionId)[0];
                                expect(targetLayer.layerId).to.equal(payload.overlayId + meridian.sandbox.sessionId); // confirms that Id is the overlayId value from the payload
                                expect(targetLayer.getVisibility()).to.be.true; // confirms that the layer basetestShowLayer is visible
                                meridian.sandbox.external.receiveMessage({
                                    data: {
                                        channel: 'map.overlay.hide',
                                        message: payload
                                    }
                                });
                                expect(targetLayer.getVisibility()).to.be.false; // confirms that the layer basetestShowLayer is not visible
                                meridian.sandbox.external.receiveMessage({
                                    data: {
                                        channel: 'map.overlay.show',
                                        message: payload
                                    }
                                });
                                expect(targetLayer.getVisibility()).to.be.true; // confirms that the layer.show emit is successful
                            });
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.overlay.create',
                                    message: payload
                                }
                            }); // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    meridian.html = $('#fixtures').html;
                    renderer.initialize.call(meridian, meridian);
                    done();
                });
            });//it

            it('Edge case: Show Layer (multiple layers added)', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        var map,
                            payload,
                            beforeLayerCreateCount,
                            afterLayerCreateCount,
                            targetLayer,
                            anotherLayer;
                        if (params.channel == 'map.status.ready') {
                            map = renderer.getMap();
                            payload = {
                                overlayId: 'edgecaseShowLayer_multiplelayeradded'
                            };
                            beforeLayerCreateCount = map.layers.length; // layer count prior to the channel emit
                            meridian.sandbox.on('map.layer.create', function (params) {
                                anotherLayer = new OpenLayers.Layer.Vector('OpenLayers Vector', {layerId: 'testOverlayId2'});
                                map.addLayer(anotherLayer);
                                afterLayerCreateCount = map.layers.length;
                                expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                                targetLayer = map.getLayersBy('layerId', 'edgecaseShowLayer_multiplelayeradded' + meridian.sandbox.sessionId)[0];
                                expect(targetLayer.layerId).to.equal(payload.overlayId + meridian.sandbox.sessionId); // confirms that Id is the overlayId value from the payload
                                expect(targetLayer.getVisibility()).to.be.true; // confirms that the layer edgecaseShowLayer_multiplelayeradded is visible
                                meridian.sandbox.external.receiveMessage({
                                    data: {
                                        channel: 'map.overlay.hide',
                                        message: payload
                                    }
                                });
                                anotherLayer.setVisibility(false);
                                expect(targetLayer.getVisibility()).to.be.false; // confirms that the layer edgecaseShowLayer_multiplelayeradded is not visible
                                expect(anotherLayer.getVisibility()).to.be.false; // confirms that the layer testOverlayId2 is visible
                                meridian.sandbox.external.receiveMessage({
                                    data: {
                                        channel: 'map.overlay.show',
                                        message: payload
                                    }
                                });
                                expect(targetLayer.getVisibility()).to.be.true; // confirms that the layer.show emit is successful
                                expect(anotherLayer.getVisibility()).to.be.false; // confirms that the layer testOverlayId2 remains hidden after the emit
                                done();
                            });
                            meridian.sandbox.external.receiveMessage({
                                data: {
                                    channel: 'map.overlay.create',
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
        });// map.overlay.show
    });//describe
});

