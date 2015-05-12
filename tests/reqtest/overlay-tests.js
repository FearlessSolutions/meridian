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
    describe('Overlay Channels', function () {
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

        // Capture the Create Layer
        it("Create a Layer (with overlayId) Unit Test", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                name: "Test Name 1",  // can't check name, because it isn't saved in OL
                                overlayId: "testOverlayId1",
                                coords: {
                                    minLat: "7.602108",
                                    minLon: "-13.908691",
                                    maxLat: "11.587669",
                                    maxLon: "-8.283691"
                                }
                            },
                            beforeLayerCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCount,
                            actualLayer;
                        //test goes here
                        map.events.register("addlayer", map, function(){
                            afterLayerCount = map.layers.length; // layer count prior to the channel emit
                            expect(afterLayerCount).to.be.above(beforeLayerCount); // confirmation that a layer was created
                            map.layers[map.layers.length-1];  //  last layer added
                            actualLayer = map.layers[map.layers.length-1];
                            expect(actualLayer).to.exist;
                            expect(actualLayer.layerId).to.equal(payload.overlayId);  // actual layerId should equal the payload overlayId
                            done();
                        });
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.create', message: payload }});  // manual publish to the channel
                    }
                };
                cmapiMain.initialize.call(meridian, meridian);
                var $fixtures = $('#fixtures');
                meridian.html = $fixtures.html;
                renderer.initialize.call(meridian, meridian);
            });
        });//it

        it("Create a Layer (without overlayId) Unit Test", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                name: "Test Name 1",  // can't check name, because it isn't saved in OL
                                overlayId: "",
                                coords: {
                                    minLat: "7.602108",
                                    minLon: "-13.908691",
                                    maxLat: "11.587669",
                                    maxLon: "-8.283691"
                                }
                            },
                            beforeLayerCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCount,
                            actualLayer;
                        //test goes here
                        map.events.register("addlayer", map, function(){
                            afterLayerCount = map.layers.length; // layer count prior to the channel emit
                            expect(afterLayerCount).to.be.above(beforeLayerCount); // confirmation that a layer was created
                            map.layers[map.layers.length-1];  //  last layer added
                            actualLayer = map.layers[map.layers.length-1];
                            expect(actualLayer.layerId).to.equal('cmapi');  // cmapi is the defaultLayerId assigned by cmapi when value is empty
                            done();
                        });
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.create', message: payload }});  // manual publish to the channel
                    }
                };
                cmapiMain.initialize.call(meridian, meridian);
                var $fixtures = $('#fixtures');
                meridian.html = $fixtures.html;
                renderer.initialize.call(meridian, meridian);
            });
        });//it

        it("Create a Layer (without coordinates) Unit Test", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                name: "Test Name 1",  // can't check name, because it isn't saved in OL
                                overlayId: "testOverlayId1"
                            },
                            beforeLayerCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCount,
                            actualLayer;
                        //test goes here
                        map.events.register("addlayer", map, function(){
                            afterLayerCount = map.layers.length; // layer count prior to the channel emit
                            expect(afterLayerCount).to.be.above(beforeLayerCount); // confirmation that a layer was created
                            map.layers[map.layers.length-1];  //  last layer added
                            actualLayer = map.layers[map.layers.length-1];
                            expect(actualLayer).to.exist;
                            expect(actualLayer.layerId).to.equal(payload.overlayId);  // actual layerId should equal the payload overlayId
                            done();
                        });
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.create', message: payload }});  // manual publish to the channel
                    }
                };
                cmapiMain.initialize.call(meridian, meridian);
                var $fixtures = $('#fixtures');
                meridian.html = $fixtures.html;
                renderer.initialize.call(meridian, meridian);
            });
        });//it

        //Capture Remove Layer
        it("Remove a Layer Unit Test", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                overlayId: "testOverlayId1"
                            },
                            beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCreateCount,
                            afterLayerRemoveCount;
                        //test goes here
                        function layerCheck(layerExists, params) {
                            var searchTerm = "testOverlayId1",
                                index = -1,
                                mapLayers = params;
                            for(var i= 0, len = mapLayers.length; i < len; i++) {
                                if(mapLayers[i].layerId === searchTerm) {
                                    index = i;
                                    break;
                                }
                            }
                            if (layerExists) {
                                expect(index).to.not.equal(-1);
                                console.debug('Layer exists, create layer successful');
                            } else {
                                expect(index).to.equal(-1); // confirm that no layers contain layerId of testOverlayId1
                                console.debug('Layer does not exist, remove layer successful');
                            }
                        }
                        meridian.sandbox.on('map.layer.create', function(params) {
                            afterLayerCreateCount = map.layers.length;
                            expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                            expect(map.layers[map.layers.length-1]["layerId"]).to.equal(payload.overlayId); // confirms that Id is the overlayId value from the payload
                            layerCheck(true, map.layers);
                        });
                        meridian.sandbox.on('map.layer.delete', function(params) {
                            afterLayerRemoveCount = map.layers.length;
                            expect(afterLayerCreateCount).to.be.above(afterLayerRemoveCount);  // confirms the layer with overlayId value from payload was removed
                            layerCheck(false, map.layers);
                        });
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.create', message: payload }}); // manual publish to the channel
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.remove', message: payload }}); // manual publish to the channel
                    }
                };
                cmapiMain.initialize.call(meridian, meridian);
                var $fixtures = $('#fixtures');
                meridian.html = $fixtures.html;
                renderer.initialize.call(meridian, meridian);
                done();
            });
        });//it

        it("Remove a Layer (multiple layer added) Unit Test", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                overlayId: "testOverlayId1"
                            },
                            beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCreateCount,
                            afterLayerRemoveCount,
                            anotherLayer;
                        console.debug('Layer count before layer is created ' + beforeLayerCreateCount);
                        //test goes here
                        function layerCheck(layerExists, params) {
                            var searchTerm = "testOverlayId1",
                                index = -1,
                                mapLayers = params;
                            for(var i= 0, len = mapLayers.length; i < len; i++) {
                                if(mapLayers[i].layerId === searchTerm) {
                                    index = i;
                                    break;
                                }
                            }
                            if (layerExists) {
                                expect(index).to.not.equal(-1);
                                console.debug('Layer exists, create layer successful');
                            } else {
                                expect(index).to.equal(-1); // confirm that no layers contain layerId of testOverlayId1
                                console.debug('Layer count after remove layer emit ' + map.layers.length );
                                console.debug('Layer does not exist, remove layer successful');
                            }
                        }
                        meridian.sandbox.on('map.layer.create', function(params) {
                            anotherLayer = new OpenLayers.Layer.Vector( "OpenLayers Vector", {layerId: 'testOverlayId2'} );
                            map.addLayer(anotherLayer);
                            afterLayerCreateCount = map.layers.length;
                            console.debug('Layer count after layer creation & additional layer ' + afterLayerCreateCount);
                            expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                            layerCheck(true, map.layers);
                        });
                        meridian.sandbox.on('map.layer.delete', function(params) {
                            afterLayerRemoveCount = map.layers.length;
                            expect(afterLayerCreateCount).to.be.above(afterLayerRemoveCount);  // confirms the layer with overlayId value from payload was removed
                            layerCheck(false, map.layers);
                        });
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.create', message: payload }}); // manual publish to the channel
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.remove', message: payload }}); // manual publish to the channel
                    }
                };
                cmapiMain.initialize.call(meridian, meridian);
                var $fixtures = $('#fixtures');
                meridian.html = $fixtures.html;
                renderer.initialize.call(meridian, meridian);
                done();
            });
        });//it

        // Capture Hide Layer
        it("Hide Layer Unit Test", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                overlayId: "testOverlayId1"
                            },
                            beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCreateCount,
                            targetLayer;
                        //test goes here
                        meridian.sandbox.on('map.layer.create', function(params) {
                            afterLayerCreateCount = map.layers.length;
                            expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                            targetLayer = map.layers[map.layers.length-1];
                            expect(targetLayer.layerId).to.equal(payload.overlayId); // confirms that Id is the overlayId value from the payload
                            expect(targetLayer.getVisibility()).to.be.true; // confirms that the layer testOverlayId1 is visible
                            console.debug("The visibility of this layer is currently set to " + targetLayer.getVisibility());
                            meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.hide', message: payload }});
                            expect(targetLayer.getVisibility()).to.be.false; // confirms that the layer testOverlayId1 is not visible
                            console.debug("The visibility of this layer is currently set to " + targetLayer.getVisibility());
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

        it("Hide Layer (multiple layers added) Unit Test", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                overlayId: "testOverlayId1"
                            },
                            beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCreateCount,
                            targetLayer,
                            anotherLayer;
                        //test goes here
                        meridian.sandbox.on('map.layer.create', function(params) {
                            anotherLayer = new OpenLayers.Layer.Vector( "OpenLayers Vector", {layerId: 'testOverlayId2'} );
                            map.addLayer(anotherLayer);
                            afterLayerCreateCount = map.layers.length;
                            expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                            targetLayer = map.layers[map.layers.length-2];
                            expect(targetLayer.layerId).to.equal(payload.overlayId); // confirms that Id is the overlayId value from the payload
                            expect(targetLayer.getVisibility()).to.be.true; // confirms that the layer testOverlayId1 is visible
                            console.debug("The visibility of layer 'testOverlayId1' is currently set to " + targetLayer.getVisibility());
                            meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.hide', message: payload }});
                            expect(targetLayer.getVisibility()).to.be.false; // confirms that the layer testOverlayId1 is not visible
                            console.debug("The visibility of layer 'testOverlayId1' is currently set to " + targetLayer.getVisibility());
                            console.log(anotherLayer.getVisibility());
                            expect(anotherLayer.getVisibility()).to.be.true; // confirms that the layer testOverlayId2 is visible after the emit
                            console.debug("The visibility of layer 'testOverlayId2' was not changed by the map.overlay.hide emit");
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

        // Capture Show Layer
        it("Show Layer Unit Test", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                overlayId: "testOverlayId1"
                            },
                            beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCreateCount,
                            targetLayer;
                        //test goes here
                        meridian.sandbox.on('map.layer.create', function(params) {
                            afterLayerCreateCount = map.layers.length;
                            expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                            targetLayer = map.layers[map.layers.length-1];
                            expect(targetLayer.layerId).to.equal(payload.overlayId); // confirms that Id is the overlayId value from the payload
                            expect(targetLayer.getVisibility()).to.be.true; // confirms that the layer testOverlayId1 is visible
                            console.debug("The visibility of this layer is currently set to " + targetLayer.getVisibility());
                            meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.hide', message: payload }});
                            expect(targetLayer.getVisibility()).to.be.false; // confirms that the layer testOverlayId1 is not visible
                            console.debug('The visibility of this layer is currently set to ' + targetLayer.getVisibility());
                            meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.show', message: payload }});
                            expect(targetLayer.getVisibility()).to.be.true; // confirms that the layer.show emit is successful
                            console.debug('Show layer successful ' + targetLayer.getVisibility());
                        });
                        meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.create', message: payload }}); // manual publish to the channel
                    }
                };
                cmapiMain.initialize.call(meridian, meridian);
                var $fixtures = $('#fixtures');
                meridian.html = $fixtures.html;
                renderer.initialize.call(meridian, meridian);
                done();
            });
        });//it

        it("Show Layer (multiple layers added) Unit Test", function (done) {
            require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                console.log('in it', meridian);
                meridian.sandbox.external.postMessageToParent = function (params) {
                    if (params.channel == 'map.status.ready') {
                        // map goes first
                        var map = renderer.getMap(),
                            payload = {
                                overlayId: "testOverlayId1"
                            },
                            beforeLayerCreateCount = map.layers.length, // layer count prior to the channel emit
                            afterLayerCreateCount,
                            targetLayer,
                            anotherLayer;
                        //test goes here
                        meridian.sandbox.on('map.layer.create', function(params) {
                            anotherLayer = new OpenLayers.Layer.Vector( "OpenLayers Vector", {layerId: 'testOverlayId2'} );
                            map.addLayer(anotherLayer);
                            afterLayerCreateCount = map.layers.length;
                            expect(afterLayerCreateCount).to.be.above(beforeLayerCreateCount);  // after should be greater than before, confirms layer was created
                            targetLayer = map.layers[map.layers.length-2];
                            expect(targetLayer.layerId).to.equal(payload.overlayId); // confirms that Id is the overlayId value from the payload
                            expect(targetLayer.getVisibility()).to.be.true; // confirms that the layer testOverlayId1 is visible
                            console.debug("The visibility of targetOverlayId1 layer is currently set to " + targetLayer.getVisibility());
                            meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.hide', message: payload }});
                            anotherLayer.setVisibility(false);
                            console.log(anotherLayer.getVisibility());
                            expect(targetLayer.getVisibility()).to.be.false; // confirms that the layer testOverlayId1 is not visible
                            expect(anotherLayer.getVisibility()).to.be.false; // confirms that the layer testOverlayId1 is visible
                            console.debug('The visibility of targetOverlayId1 layer is currently set to ' + targetLayer.getVisibility());
                            meridian.sandbox.external.receiveMessage({data:{channel:'map.overlay.show', message: payload }});
                            expect(targetLayer.getVisibility()).to.be.true; // confirms that the layer.show emit is successful
                            console.debug('Show layer successful ' + targetLayer.getVisibility());
                            expect(anotherLayer.getVisibility()).to.be.false; // confirms that the layer testOverlayId2 remains hidden after the emit
                            console.debug("The visibility of layer 'testOverlayId2' was not changed by the map.overlay.hide emit");
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

    });//describe
});

