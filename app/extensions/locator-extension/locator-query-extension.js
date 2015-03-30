define([
    'text!./info-win.hbs',
    'text!./info-win.css',
	'./locator-configuration',
    'handlebars'
], function(infoWinHBS, infoWinCSS, configuration){
    var context,
        infoWinTemplate,
        LAYER_ID = 'static_geolocator';

    var exposed = {
        initialize: function(app) {
            context = app;
            infoWinTemplate = Handlebars.compile(infoWinHBS);
            app.sandbox.utils.addCSS(infoWinCSS, 'locator-info-window-style');

            app.sandbox.locator = {
                query: query,
                createCoordinatesGeoJSON: createCoordinatesGeoJSON,
                createLocationGeoJSON: createLocationGeoJSON,
                buildInfoWinTemplate: buildInfoWinTemplate,
                postRenderingAction: postRenderingAction
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

                data.results.forEach(function(result){
                    var name = result.formatted_address;

                    if(!formatted.data[name]){
                        formatted.names.push(name);
                        formatted.data[name] = result;
                    }

                });

                callback(formatted);
            }

        });
    }

    function createCoordinatesGeoJSON(coordinates){
        var featureId = context.sandbox.utils.UUID(),
            lat = parseFloat(coordinates.dd.lat),
            lon = parseFloat(coordinates.dd.lon),
            dmsString = '', //TODO finish up this as needed, based on Jorges changes
            geoJSON;

        geoJSON = {
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
        };

        return geoJSON;
    }

    function createLocationGeoJSON(data, callback){
        var featureId = context.sandbox.utils.UUID(),
            geoJSON,
            geometry = data.geometry;

        geoJSON = {
            id: featureId,
            featureId: featureId,
            layerId: LAYER_ID,
            geometry: {
                type: 'Point',
                coordinates: [
                    geometry.location.lng,
                    geometry.location.lat
                ]
            },
            properties: data,
            bbox: {
                minLat: geometry.viewport.southwest.lat,
                minLon: geometry.viewport.southwest.lng,
                maxLat: geometry.viewport.northeast.lat,
                maxLon: geometry.viewport.northeast.lng

            }
        };

        callback(null, geoJSON);
    }

    function buildInfoWinTemplate(feature){
        //Do a deep copy to prevent deletion of feature properties.
        var attributes = {};
        context.sandbox.util.each(feature.attributes, function(attribute, value){
            attributes[attribute] = value;
        });

        //Remove properties that we don't want shown
        delete attributes.dataService;
        delete attributes.icon;
        delete attributes.height;
        delete attributes.width;

        return infoWinTemplate({
            attributes: attributes,
            title: ''//'TODO' //TODO
        });
    }

    function postRenderingAction(feature){
        $('.location .infoDiv .hide-location .btn').on('click', function(){
            context.sandbox.emit('map.features.hide', {
                featureIds: [feature.featureId],
                layerId: LAYER_ID
            });
        });
    }
});