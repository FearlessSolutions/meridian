define([
    'chai',
    'meridian-config',
    'aura/aura',
    'mocha'
], function(chai, configuration, Aura) {
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

        //it("Message should match.", function() {
        //	require(['uploadComponent/upload-data-publisher'], function(upload){
        //		upload.init(meridian);
        //     console.log(meridian);
        //		console.log('upload component: ', upload);
        //		var actual;
        //
        //	var expected = {
        //		messageType: 'warning',
        //          messageTitle: 'Data Upload',
        //          messageText: 'File type not supported for upload'
        //	};
        //	meridian.sandbox.on('message.publish',function(params){
        //		actual = params;
        //	});
        //
        //		upload.publishMessage(expected);
        //		console.debug('actual: ', actual);
        //		console.debug('expected: ', expected);
        //		chai.assert.deepEqual(actual,expected);
        //	});
        //});//it


        // Capture the Map-click
        //it("Map Click", function () {
        //    require(['components/apis/cmapi/main'], function (cmapiMain) {
        //        console.log('in it', meridian);
        //        meridian.sandbox.external.postMessageToParent = function () {
        //            console.log('this is the map-click listener');
        //        };
        //meridian.sandbox.on('map.click', function(params) { console.log('zoomListen')} );
        //
        //        cmapiMain.initialize.call(meridian, meridian);
        //
        //        meridian.sandbox.emit('map.click', {
        //            lat: 11.910353555773261,
        //            lon: -8.020019531249982,
        //            button: "left",
        //            type: "single"
        //        }); // the lat/long is here //
        //
        //        //chai.assert.equal(actual, expected);
        //        //chai.assert.ok(false, 'this will fail');
        //
        //    });
        //});//it

    });//describe
});

