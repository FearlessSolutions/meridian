define([
], function() {
    var activeAJAXs;
    /**
     * @exports ajax-handler-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.ajax} to the {@link Sandbox} namespace.
         * @function
         * @instance
         * @param  {Object} app Instance of the Meridian application.
         */
        initialize: function(app) {
            /**
             * Consolidated holding place for open AJAX calls.
             * Cleans and aborts as required.
             * @namespace Sandbox.ajax
             */
            /**
             * Local variable that stores all active AJAX calls.
             * @var {Array} activeAJAXs
             * @instance
             * @memberof Sandbox.ajax
             */
            activeAJAXs = [];
            app.sandbox.ajax = {
                /**
                 * Add a new AJAX to the list.
                 * If it is a query, add the property to the call.
                 * @function
                 * @instance
                 * @param {Object} params
                 * @param {String} params.newAJAX - Value added to the {@link Sandbox.ajax#activeAJAXs activeAJAXs array}
                 * @param {String} params.layerId - Value added to newAJAX.
                 * @example params.newAJAX.layerId
                 * @memberof Sandbox.ajax
                 */
                addActiveAJAX: function (params) {
                    if(params.layerId) {
                        params.newAJAX.layerId = params.layerId;
                    }
                    activeAJAXs.push(params.newAJAX);
                },
                /**
                 * Remove all finished AJAX from the {@link Sandbox.ajax#activeAJAXs activeAJAXs array}.
                 * @function
                 * @instance
                 * @memberof Sandbox.ajax
                 */
                clean: function() {
                    activeAJAXs.forEach(function(ajax, index) {
                        if(ajax.readyState === 4) { //4 is "complete" status
                            activeAJAXs.splice(index, 1);
                        }
                    });
                },
                /**
                 * Abort ALL open AJAX from the {@link Sandbox.ajax#activeAJAXs activeAJAXs array}.
                 * @function
                 * @instance
                 * @memberof Sandbox.ajax
                 */
                clear: function() {
                    activeAJAXs.forEach(function(ajax, index) {
                        ajax.abort();
                        activeAJAXs.splice(index, 1);
                    });
                },
                /**
                 * Aborts AJAX based on layerId from the {@link Sandbox.ajax#activeAJAXs activeAJAXs array}.
                 * @function
                 * @instance
                 * @params {Object} params
                 * @param {String} params.layerId - Layer Id of AJAX.
                 * @memberof Sandbox.ajax
                 */
                stopQuery: function(params) {
                    activeAJAXs.forEach(function(ajax, index) {
                        if(ajax.layerId === params.layerId) {
                            ajax.abort();
                            activeAJAXs.splice(index, 1);
                        }
                    });
                }
            };

            //Register a listener so that clean is automatically called after each ajax call
            $(document).ajaxComplete(app.sandbox.ajax.clean);
        }
    };



    return exposed;
});
