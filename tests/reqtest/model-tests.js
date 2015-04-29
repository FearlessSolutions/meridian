define([
    'chai',
    'meridian-config',
    'aura/aura',
    'mocha'
], function(chai, configuration, Aura) {
    console.debug('test');


//This doesnt work on the command line by doing $ mocha <thisFile>
//Unless there is a way of including the require.js file and the config file in the command
//prompt, I only see this working in the browser.

//start your test here.
//mocha needs to see describe globally. If you try putting it in a function, it wont execute. (Unless my test wasn't good.)
    describe('Upload Component message.publish channel', function () {
        var upload, exitBeforeEach, meridian;

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
                .use('extensions/external-pubsub-extension/external-pubsub-extension')
                .use('extensions/state-manager-extension/state-manager-extension')
                .use('extensions/data-storage-extension/data-storage-extension')
                .use('extensions/snapshot-extension/snapshot-extension')
                .use('extensions/map-configuration-extension/map-configuration-extension')
                .use('extensions/user-settings-extension/user-settings-extension')
                .use('extensions/support-configuration-extension/support-configuration-extension')
                .use('extensions/icon-extension/icon-extension')
                .use('extensions/exports/export-utils/export-utils')

                .start({ components: 'body' })
                .then(function () {
                    //start test
                    //must wait until aura starts before doing anything test related.
                    //If not, meridian variable will be undefined.
                    exitBeforeEach();

                });//end of then

        });//end of beforeEach


        it("Message should match.", function () {
            require(['components/tools/upload-data/upload-data-publisher'], function (upload) {
                upload.init(meridian);
                console.log('upload component: ', upload);
                console.log(meridian.config);
                var actual;

                var expected = {
                    messageType: 'warning',
                    messageTitle: 'Data Upload',
                    messageText: 'File type not supported for upload'
                };
                meridian.sandbox.on('message.publish', function (params) {
                    actual = params;

                });

                upload.publishMessage(expected);
                console.debug('actual: ', actual);
                console.debug('expected: ', expected);
                console.debug("meridian: ", meridian);
                console.log(meridian.sandbox.on.params);
                chai.assert.deepEqual(actual, expected);
            });


        });//it
    });//describe
});