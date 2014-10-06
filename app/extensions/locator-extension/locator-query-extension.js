define([
	'./locator-configuration'
], function(locatorConfiguration){
    /**
     * @namespace Sandbox.locator.query
     * @memberof Sandbox.locator
     */
    /**
     * @namespace Sandbox.locator.queryCoordinates
     * @memberof Sandbox.locator
     */
    /**
     * Array of Objects. Each object is a different coordinate system.
     * @var COORDINATE_SYSYEMS 
     * @instance
     * @property {String} Name      - Name of the coordinate system.
     * @property {Function} convert -  Returns converted coordinates
     * @property {String} regex     - Expression used to match the input with the desired coordinate system.
     * @memberof Sandbox.locator.query
     */
    var COORDINATE_SYSYEMS = [
        {
            "Name": "Decimal Degrees(DD)",
            "convert": function(input){
                var coordinates = input.replace(/\s/g, '').split(',');

                return {
                    "lon": parseFloat(coordinates[locatorConfiguration.lonIndex], 10),
                    "lat": parseFloat(coordinates[locatorConfiguration.latIndex], 10)
                };
            },
            "regex": /(^-?)\d+(\.\d+)?,[\s-]*-?\d+(\.\d+)?\s*$/
        },
        {
            "Name": "DegreesMinutes.Seconds (DMS)",
            "convert": function(input){
                var north = input.match(/^\d{6}(\.\d+)?N/),
                    south = input.match(/^\d{6}(\.\d+)?S/),
                    west = input.match(/\d{6,7}(\.\d+)?W$/),
                    east = input.match(/\d{6,7}(\.\d+)?E$/);

                if((north || south) && (west || east)){
                    var coordinates = {
                        "lat": 0,
                        "lon" : 0
                    };

                    if(north){
                        coordinates.lat = parseCoordinate(north[0]);
                    }else{ //south
                        coordinates.lat = parseCoordinate(south[0]) * (-1); //South is negative
                    }

                    if(east){
                        coordinates.lon = parseCoordinate(east[0]);
                    }else{ //West
                        coordinates.lon = parseCoordinate(west[0]) * (-1); //West is negative
                    }

                    return coordinates;
                }else{
                    return null;
                }

                /**
                 * Parses a part of DegreeMinutes.Seconds
                 *  coordinate The part that was parsed
                 */
                function parseCoordinate(coordinateString){
                    var splitAtDecimal = coordinateString.split('.'),
                        integerStringArray = splitAtDecimal[0].split(''),
                        degrees,
                        minutes,
                        seconds,
                        coordinate;

                    //Split the coordinate as String/Array
                    seconds = integerStringArray.splice(-2).concat(['.'], splitAtDecimal[1].split(''));
                    seconds = parseFloat(seconds.join(''));
                    minutes = integerStringArray.splice(-2);
                    minutes = parseFloat(minutes.join(''));
                    degrees = parseFloat(integerStringArray.join(''));

                    coordinate = degrees + (minutes/60) + (seconds/3600);
                    return coordinate;
                }
            },
            "regex": /(^-?)\d+(\.\d+)?[NSEW],[\s-]*-?\d+(\.\d+)?[NSEW]\s*$/
        }
    ];
    /**
     * @exports locator-query-extension
     */
    var exposed = {
         /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension exposes {@link Sandbox.locator.query} and
         * {@link Sandbox.locator.queryCoordinates} to the {@link Sandbox.locator} namespace.
         * @function
         * @instance
         * @param {Object} app Instance of the Meridian application.
         */
        "initialize": function(app) {

            if (!app.sandbox.locator) {
                app.sandbox.locator = {};
            }

            if (!app.sandbox.locator.query) {
                app.sandbox.locator.query = {};
            }

            app.sandbox.locator.queryCoordinates = queryCoordinates;

            /**
             * Modify this function or provide your own so it works
             * correctly with the {@link Sandbox.locator.formatData} implementation, which can also be modified.
             * This implementation sets the data object of the ajax call to work specifically with the default
             * URL property found in {@link Sandbox.locator#locatorConfiguration locatorConfiguration}.
             * @function query
             * @instance
             * @param  {Object} param - Name of the location 
             * @param  {Function} callback - Called after a success callback function of an ajax call.
             * @memberof Sandbox.locator.query
             * @example context.sandbox.locator.query(query, function(data){
             * }
             */
            app.sandbox.locator.query = function(param, callback) {

                var data = {
                    "address": param,
                    "sensor": false
                };
                app.sandbox.utils.ajax({
                    "type": "GET",
                    "url": locatorConfiguration.url,
                    "data": data,
                    "dataType": locatorConfiguration.dataType,
                    "timeout": locatorConfiguration.timeout,
                    "error": function(xhr, status, errorThrown) {
                        app.sandbox.emit("message.publish", {
                            "messageType": 'error',
                            "messageTitle": 'Location Service',
                            "messageText": errorThrown
                        }); 
                    },
                    "success": function(data) {
                        //return the exact same data value.
                        callback(data);
                    }

                });
            };

        }
    };

    return exposed;

    /**
     * @function
     * @instance
     * @param {String} input    
     * @param {Function} callback - Called when input matches a coordinate system regex.
     * Null when none found.
     * @memberof Sandbox.locator.queryCoordinates
     */
    function queryCoordinates(input, callback){
        var coordinates = null;
        COORDINATE_SYSYEMS.forEach(function(coordinateSystem){
            if(input.match(coordinateSystem.regex)){
                coordinates = coordinateSystem.convert(input);
            }
        });

        callback(coordinates);
    }
});