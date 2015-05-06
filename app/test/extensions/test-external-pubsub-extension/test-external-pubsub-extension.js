define([
], function() {

    var callbacks;
    var somevar;
    var exposed = {
        initialize: function(app) {
            callbacks = [];
            if (!somevar){somevar = 1}
            else {somevar ++}


            if (!app.sandbox.external) {
                app.sandbox.external = {};
            }

            app.sandbox.external.onPostMessage = function(callback) {
                callbacks.push(callback);
            };

            app.sandbox.external.postMessageToParent = function(msg) {
                // empty function to be filled out
            };
            app.sandbox.external.receiveMessage = function(event) {
                console.log (somevar, callbacks.length);
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
