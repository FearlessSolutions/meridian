define([
], function() {

    var callbacks = [];

    var exposed = {
        initialize: function(app) {

            if (!app.sandbox.external) {
                app.sandbox.external = {};
            }

            app.sandbox.external.onPostMessage = function(callback) {
                callbacks.push(callback);
            };

            app.sandbox.external.postMessageToParent = function(msg) {
                // empty function to be filled out
                console.log('testinextension');
            };
            app.sandbox.external.receiveMessage = function(event) {
                callbacks.forEach(function(callback) {
                    if (callback && typeof callback === 'function') {
                        callback(event);
                    }
                });
            }
        }
    };

    return exposed;

});
