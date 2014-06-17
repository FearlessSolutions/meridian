define([
	'./locator-configuration.js'
], function(locatorConfiguration){

    var exposed = {
        initialize: function(app) {

            if (!app.sandbox.locator) {
                app.sandbox.locator = {};
            }

            if (!app.sandbox.locator.query) {
                app.sandbox.locator.query = {};
            }

            /**
             * [query description]
             * @param  {[type]}   param    [description]
             * @param  {Function} callback [description]
             * @return {[type]}            [description]
             */
            app.sandbox.locator.query = function(param, callback) {

                var data = {
                    address: param,
                    sensor: false
                };
                app.sandbox.utils.ajax({
                    type: 'GET',
                    url: locatorConfiguration.url,
                    data: data,
                    dataType: locatorConfiguration.dataType,
                    timeout: locatorConfiguration.timeout,
                    error: function(xhr, status, errorThrown) {
                        app.sandbox.emit("message.publish", {
                            "messageType": 'error',
                            "messageTitle": 'Location Service',
                            "messageText": errorThrown
                        }); 
                    },
                    success: function(data) {
                        //return the exact same data value.
                        callback(data);
                    }

                });
            };

        }
    };

    return exposed;

});