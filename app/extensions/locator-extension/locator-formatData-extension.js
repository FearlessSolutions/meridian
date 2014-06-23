define([
	'./locator-configuration.js'
], function(locatorConfiguration){

    var exposed = {
        initialize: function(app) {

            if (!app.sandbox.locator) {
                app.sandbox.locator = {};
            }

            if (!app.sandbox.locator.formatData) {
                app.sandbox.locator.formatData = {};
            }

            /**
             * Formats data and separates it by names and the data needed to use the typeahead
             * implementation found in component/tool/locator. (locator.js)
             * @param  {[type]} param [description]
             * @return {JSON}       JSON Object containing an array called 'name' and a 'data' object.
             * array is used to populate the dropdown from the typeahead. 
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