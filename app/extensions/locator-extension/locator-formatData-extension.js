define([
	'./locator-configuration'
], function(locatorConfiguration){
    /**
     * @namespace Sandbox.locator.formatData
     * @memberof Sandbox.locator
     */
    /**
     * @exports locator-formatData-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.locator.formatData} to the {@link Sandbox.locator} namespace.
         * @function
         * @instance
         * @param {Object} app Instance of the Meridian application.
         */
        initialize: function(app) {

            if (!app.sandbox.locator) {
                app.sandbox.locator = {};
            }

            if (!app.sandbox.locator.formatData) {
                app.sandbox.locator.formatData = {};
            }

            /**
             * Changes data into desired format. Modify this function or provide your own so it works
             * correctly with the {@link Sandbox.locator.query} implementation, which can also be modified.
             * This implementation separates the param provided by names and the data needed to use the typeahead
             * library implemented in <link to component>.
             * @function formatData
             * @instance
             * @param param - Same parameter passed into the success callback of an ajax call. 
             * @return {Object} Contains an array property called 'name' and an object property
             * called 'data'. 'Name' is used to populate the dropdown from the typeahead.
             * @memberof Sandbox.locator.formatData 
             * @example context.sandbox.locator.query(query, function(data){
             *   var formattedData = context.sandbox.locator.formatData(data);
             * }
             * //formattedData:
             * {
             *   "names": names,
             *   "data": data
             * };
             */
            app.sandbox.locator.formatData = function(param) {
                var names = [],
                data = {};
                if(param.status === 'ZERO_RESULTS') {
                    if(locatorConfiguration.noResultsMsg !== ""){
                        app.sandbox.emit("message.publish", {
                            "messageType": 'warning',
                            "messageTitle": 'Location Service',
                            "messageText": locatorConfiguration.noResultsMsg
                        }); 
                    }
                }else {
                    app.sandbox.utils.each(param.results, function(i,value){
                        //params.minLon, params.minLat, params.maxLon, params.maxLat
                        var obj = {
                            name: value.formatted_address,
                            minLon: value.geometry.viewport.southwest.lng,
                            minLat: value.geometry.viewport.southwest.lat,
                            maxLon: value.geometry.viewport.northeast.lng,
                            maxLat: value.geometry.viewport.northeast.lat
                        };
                        names.push(obj.name);
                        data[obj.name] = obj;
                    });
                }
                return {
                        "names": names,
                        "data": data
                    };
            };
        }//end of initialize
    };

    return exposed;

});