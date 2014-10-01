define([
], function() {

    var callbacks = [];
    /**
      * @namespace Sandbox.external
      * @memberof Sandbox
      */
    /**
      * @exports external-pubsub-extension
      */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.external} to the {@link Sandbox} namespace.
         * The function adds an even listener on window with "message" as the event. 
         * @function
         * @instance
         * @param {Object} app Instance of the Meridian application.
         */
        initialize: function(app) {
            window.addEventListener("message", receiveMessage, false); //TODO: third param?

            if (!app.sandbox.external) {
                app.sandbox.external = {};
            }

            /**
             * Function description needed.
             * @function onPostMessage
             * @instance
             * @param {Function} callback - Description needed.
             * @memberof Sandbox.external
             */
            app.sandbox.external.onPostMessage = function(callback) {
                callbacks.push(callback);
            };

            /**
             * Post message to parent: window.opener or window.parent
             * Message will be sent to '*'.
             * @function postMessageToParent
             * @instance
             * @param  {String} msg - Message to be sent 
             * @memberof Sandbox.external
             */
            app.sandbox.external.postMessageToParent = function(msg) {
                var parent = window.opener || window.parent;
                parent.postMessage(msg, '*'); // TODO: fix '*'
            };
        }
    };

    /**
     * Function description needed.
     * @function receiveMessage
     * @instance
     * @param event - Description needed.
     * @memberof external-pubsub-extension
     */
    function receiveMessage(event) {
        callbacks.forEach(function(callback) {
            if (callback && typeof callback === 'function') {
                callback(event);
            }
        });
    }

    return exposed;

});
