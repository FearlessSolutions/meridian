define([
    'text!./info-win.hbs',
    'text!./info-win.css',
	'./locator-configuration',
    'handlebars'
], function(infoWinHBS, infoWinCSS, configuration){
    var context,
        infoWinTemplate,
        LAYER_ID = 'static_geolocator';

//    var COORDINATE_SYSYEMS = [
//        {
//            Name: 'Decimal Degrees(DD)',
//            convert: function(input){
//                var coordinates = input.replace(/\s/g, '').split(',');
//
//                return {
//                    lon: parseFloat(coordinates[locatorConfiguration.lonIndex], 10),
//                    lat: parseFloat(coordinates[locatorConfiguration.latIndex], 10)
//                };
//            },
//            regex: /(^-?)\d+(\.\d+)?,[\s-]*-?\d+(\.\d+)?\s*$/
//        },
//        {
//            Name: 'DegreesMinutes.Seconds (DMS)',
//            convert: function(input){
//                var north = input.match(/^\d{6}(\.\d+)?N/),
//                    south = input.match(/^\d{6}(\.\d+)?S/),
//                    west = input.match(/\d{6,7}(\.\d+)?W$/),
//                    east = input.match(/\d{6,7}(\.\d+)?E$/);
//
//                if((north || south) && (west || east)){
//                    var coordinates = {
//                        lat: 0,
//                        lon : 0
//                    };
//
//                    if(north){
//                        coordinates.lat = parseCoordinate(north[0]);
//                    }else{ //south
//                        coordinates.lat = parseCoordinate(south[0]) * (-1); //South is negative
//                    }
//
//                    if(east){
//                        coordinates.lon = parseCoordinate(east[0]);
//                    }else{ //West
//                        coordinates.lon = parseCoordinate(west[0]) * (-1); //West is negative
//                    }
//
//                    return coordinates;
//                }else{
//                    return null;
//                }
//
//                /**
//                 * Parses a part of DegreeMinutes.Seconds
//                 * @param coordinate The part that was parsed
//                 */
//                function parseCoordinate(coordinateString){
//                    var splitAtDecimal = coordinateString.split('.'),
//                        integerStringArray = splitAtDecimal[0].split(''),
//                        degrees,
//                        minutes,
//                        seconds,
//                        coordinate;
//
//                    //Split the coordinate as String/Array
//                    seconds = integerStringArray.splice(-2).concat(['.'], splitAtDecimal[1].split(''));
//                    seconds = parseFloat(seconds.join(''));
//                    minutes = integerStringArray.splice(-2);
//                    minutes = parseFloat(minutes.join(''));
//                    degrees = parseFloat(integerStringArray.join(''));
//
//                    coordinate = degrees + (minutes/60) + (seconds/3600);
//                    return coordinate;
//                }
//            },
//            regex: /(^-?)\d+(\.\d+)?[NSEW],[\s-]*-?\d+(\.\d+)?[NSEW]\s*$/
//        }
//    ];

    var exposed = {
        initialize: function(app) {
            context = app;
            infoWinTemplate = Handlebars.compile(infoWinHBS);
            app.sandbox.utils..addCSS(infoWinCSS, 'locator-info-window-style');

            app.sandbox.locator = {
                query: query,
                createCoordinatesGeoJSON: createCoordinatesGeoJSON,
                createLocationGeoJSON: createLocationGeoJSON,
                buildInfoWinTemplate: buildInfoWinTemplate,
                postRenderingAction: postRenderingAction
            };

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
                    url: app.sandbox.utils.getCurrentNodeJSEndpoint() + locatorConfiguration.url,
                    data: data,
                    dataType: locatorConfiguration.dataType,
                    timeout: locatorConfiguration.timeout,
                    error: function(xhr, status, errorThrown) {
                        app.sandbox.emit('message.publish', {
                            messageType: 'error',
                            messageTitle: 'Location Service',
                            messageText: errorThrown
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

    function query(params, callback){

        var data = {
            address: params,
            sensor: false
        };
        context.sandbox.utils.ajax({
            type: 'GET',
            url: context.sandbox.utils.getCurrentNodeJSEndpoint() + configuration.url,
            data: data,
            dataType: configuration.dataType,
            timeout: configuration.timeout,
            error: function(xhr, status, errorThrown) {
                context.sandbox.emit('message.publish', {
                    messageType: 'error',
                    messageTitle: 'Location Service',
                    messageText: errorThrown
                });
            },
            success: function(data) {
                var formatted = {
                    names: [],
                    data: {}
                };

                if(!data){
                    return formatted;
                }
                console.debug(data);

                //TODO format as geoJSON

                callback(formatted);
            }

        });
    }

    function createCoordinatesGeoJSON(coordinates){
        var featureId = context.sandbox.utils.UUID(),
            lat = parseFloat(coordinates.dd.lat),
            lon = parseFloat(coordinates.dd.lon),
            dmsString = ''; //TODO finish up this as needed, based on Jorges changes

        return {
            id: featureId,
            featureId: featureId,
            layerId: LAYER_ID,
            geometry: {
                type: 'Point',
                coordinates: [
                    lon,
                    lat
                ]
            },
            type: 'feature',
            properties: {
                dd: '' + lon + ', ' + lat,
                dms: dmsString, //TODO
                MGRS: coordinates.mgrs,
                UTM: coordinates.utm
            },
            bbox: {
                minLat: lat - 20,
                minLon: lon - 20,
                maxLat: lat + 20,
                maxLon: lon + 20
            }
        }
    }

    function createLocationGeoJSON(data, callback){
        //TODO
    }

    function buildInfoWinTemplate(feature){
        var attributes = feature.attributes;

        //Remove properties that we don't want shown
        delete attributes.dataService;
        delete attributes.icon;
        delete attributes.height;
        delete attributes.width;

        return infoWinTemplate({
            attributes: attributes,
            title: 'TODO' //TODO
        });
    }

    function postRenderingAction(feature){
        $('.location .infoDiv .hid-location .btn').on('click', function(){
            context.sandbox.emit('map.features.hide', {
                featureIds: [feature.featureId],
                layerId: LAYER_ID
            });
        });
    }
});