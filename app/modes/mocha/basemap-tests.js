define([
    'chai',
    'meridian-config',
    'aura/aura',
    'mocha'
], function(chai, configuration, Aura) {

//This doesnt work on the command line by doing $ mocha <thisFile>
//Unless there is a way of including the require.js file and the config file in the command
//prompt, I only see this working in the browser.

    var  expect = chai.expect;

//start your test here.
//mocha needs to see describe globally. If you try putting it in a function, it wont excecute. (Unless my test wasn't good.)
    describe('Basemap Channels', function () {
        var exitBeforeEach,
            meridian;

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

        describe('map.basemap.change', function () {
            // Capture the Basemap change
            it('Base Test: Change the Basemap', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    meridian.sandbox.external.postMessageToParent = function (params) {
                        if (params.channel == 'map.status.ready') {
                            // map goes first
                            var map = renderer.getMap(),
                                payload = {
                                    basemap: 'imagery'
                                },
                                initialBasemap = {
                                    basemap: 'landscape'
                                },
                                expectedBasemap = {  // expected value result after map.basemap.change emitted
                                    basemap: 'imagery'
                                },
                                actualBasemap, mapUrl;
                            //test goes here
                            expect(payload).to.exist; // payload exists
                            expect(payload).to.be.an('object'); // payload is an object
                            meridian.sandbox.on('map.basemap.change', function(params) {
                                expectedBasemap;
                                actualBasemap = params;
                                expect(actualBasemap).to.exist; // payload is neither null or undefined
                                expect(actualBasemap).to.be.an('object'); // payload is an object
                                expect(initialBasemap).to.not.equal(actualBasemap);
                                expect(actualBasemap).to.deep.equal(expectedBasemap);
                                done();
                            });
                            meridian.sandbox.external.receiveMessage({data:{channel:'map.basemap.change', message: payload }});  // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    var $fixtures = $('#fixtures');
                    meridian.html = $fixtures.html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it
            it('Edge case: Confirm the baselayer.url has changed', function (done) {
                require(['components/apis/cmapi/main', 'components/rendering-engines/map-openlayers/main'], function (cmapiMain, renderer) {
                    var $fixtures = $('#fixtures');

                    meridian.sandbox.external.postMessageToParent = function (params) {
                        if (params.channel == 'map.status.ready') {
                            // map goes first
                            var map = renderer.getMap(),
                                payload = {
                                    basemap: 'imagery'
                                },
                                initialBasemap = {
                                    basemap: 'landscape'
                                },
                                expectedBasemap = {  // expected value result after map.basemap.change emitted
                                    basemap: 'imagery'
                                },
                                actualBasemap, mapUrl;
                            //test goes here
                            expect(payload).to.exist; // payload exists
                            expect(payload).to.be.an('object'); // payload is an object
                            meridian.sandbox.on('map.basemap.change', function(params) {
                                expectedBasemap;
                                actualBasemap = params;
                                expect(actualBasemap).to.exist; // payload is neither null or undefined
                                expect(actualBasemap).to.be.an('object'); // payload is an object
                                expect(initialBasemap).to.not.equal(actualBasemap);
                                expect(actualBasemap).to.deep.equal(expectedBasemap);
                                mapUrl = map['baseLayer']['url'].indexOf('USGSImageryOnly');
                                expect(mapUrl).to.not.equal(-1);  // indexOf is -1 when the value does not occur in the string (false)
                                done();
                            });
                            meridian.sandbox.external.receiveMessage({data:{channel:'map.basemap.change', message: payload }});  // manual publish to the channel
                        }
                    };
                    cmapiMain.initialize.call(meridian, meridian);
                    meridian.html = $fixtures.html;
                    renderer.initialize.call(meridian, meridian);
                });
            });//it
        });//map.basemap.change
    });//describe
});

