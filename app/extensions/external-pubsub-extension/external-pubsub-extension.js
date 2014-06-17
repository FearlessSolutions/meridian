define([
], function() {

    var callbacks = [];

    var exposed = {
        initialize: function(app) {
            window.addEventListener("message", receiveMessage, false); //TODO: third param?

            if (!app.sandbox.external) {
                app.sandbox.external = {};
            }

            app.sandbox.external.onPostMessage = function(callback) {
                callbacks.push(callback);
            };

            app.sandbox.external.postMessageToParent = function(msg) {
                var parent = window.opener || window.parent;
                parent.postMessage(msg, '*'); // TODO: fix '*'
            };
        }
    };

    function receiveMessage(event) {
        callbacks.forEach(function(callback) {
            if (callback && typeof callback === 'function') {
                callback(event);
            }
        });
    }

    return exposed;

});
