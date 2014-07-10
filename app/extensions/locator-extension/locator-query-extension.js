define([
	'./locator-configuration.js'
], function(locatorConfiguration){

    var COORDINATE_SYSYEMS = [
        {
            "Name": "Decimal Degrees(DD)",
            "convert": function(input){
                var coordinates = input.split(',');
                return {
                    "lon": parseFloat(coordinates[0], 10),
                    "lat": parseFloat(coordinates[1], 10)
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
                 * @param coordinate The part that was parsed
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

    var exposed = {
        initialize: function(app) {

            if (!app.sandbox.locator) {
                app.sandbox.locator = {};
            }

            if (!app.sandbox.locator.query) {
                app.sandbox.locator.query = {};
            }

            app.sandbox.locator.queryCoordinates = queryCoordinates;

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