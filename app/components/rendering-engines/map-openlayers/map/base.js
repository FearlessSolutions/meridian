define([
    './../map-api-publisher',
    './../libs/openlayers-2.13.1/OpenLayers'
], function(publisher){
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        createMap: function(params) {
            var mapElement,
                map,
                showCursorLocationDefault = true;
                
            mapElement = (params && params.el) ? params.el : 'map';
            map = new OpenLayers.Map(mapElement,{
                controls: [new OpenLayers.Control.Navigation()],
                projection: new OpenLayers.Projection(context.sandbox.mapConfiguration.projection),
                projectionWGS84: new OpenLayers.Projection('EPSG:4326')
            });

            exposed.addSelector({
                "map": map
            });

            // Check user settings for default setting to display cursor location
            if(context.sandbox.cursorLocation && 
                typeof context.sandbox.cursorLocation.defaultDisplay !== undefined) {
                showCursorLocationDefault = context.sandbox.cursorLocation.defaultDisplay; 
            }

            // TODO: Why use cooridnates.startOn as the var name?
            if(context.sandbox.mapConfiguration.coordinates && context.sandbox.mapConfiguration.coordinates.startOn && showCursorLocationDefault){
                exposed.trackMousePosition({
                    "map": map
                });
            }

            return map;
        },
        loadBasemaps: function(params) {
            var basemapLayers = {};

            context.sandbox.utils.each(context.sandbox.mapConfiguration.basemaps, function(value){
                var olBaseLayer;

                switch (context.sandbox.mapConfiguration.basemaps[value].type){
                    case "osm":
                        olBaseLayer = new OpenLayers.Layer.OSM(
                            context.sandbox.mapConfiguration.basemaps[value].label,
                            [context.sandbox.mapConfiguration.basemaps[value].url]
                        ); 
                        break;
                    case "wmts":
                        olBaseLayer = new OpenLayers.Layer.WMTS({
                            name: context.sandbox.mapConfiguration.basemaps[value].name,
                            url: context.sandbox.mapConfiguration.basemaps[value].url,
                            style: context.sandbox.mapConfiguration.basemaps[value].style,
                            matrixSet: context.sandbox.mapConfiguration.basemaps[value].matrixSet || context.sandbox.mapConfiguration.projection,
                            matrixIds: context.sandbox.mapConfiguration.basemaps[value].matrixIds || null,
                            layer: context.sandbox.mapConfiguration.basemaps[value].layer || null,
                            requestEncoding: context.sandbox.mapConfiguration.basemaps[value].requestEncoding || 'KVP',
                            format: context.sandbox.mapConfiguration.basemaps[value].format || 'image/jpeg',
                            resolutions: context.sandbox.mapConfiguration.basemaps[value].resolutions || null,
                            tileSize: new OpenLayers.Size(
                                context.sandbox.mapConfiguration.basemaps[value].tileWidth || 256,
                                context.sandbox.mapConfiguration.basemaps[value].tileHeight || 256
                            )
                        }); 
                        break;
                    default:
                        context.sandbox.logger.error('Did not load basemap. No support for basemap type:', context.sandbox.mapConfiguration.basemaps[value].type);
                        break;
                }
                if(olBaseLayer){
                    basemapLayers[context.sandbox.mapConfiguration.basemaps[value].basemap] = olBaseLayer;
                    params.map.addLayer(olBaseLayer);
                }
            });

            return basemapLayers;
        },
        setBasemap: function(params) {
            params.map.setBaseLayer(params.basemapLayer);
        },
        addSelector: function(params) {
            var selector = new OpenLayers.Control.SelectFeature([], {
                "click": true,
                "autoActivate": true
            });
            params.map.addControl(selector);
        },
        addLayerToSelector: function(params) {
            var selector = params.map.getControlsByClass('OpenLayers.Control.SelectFeature')[0];
            selector.setLayer([params.layer]);
        },
        removeAllSelectors: function(params) {
            var controls = params.map.getControlsByClass('OpenLayers.Control.SelectFeature');
            controls.forEach(function(control) {
                control.destroy();
            });
        },
        resetSelector: function(params) {
            exposed.removeAllSelectors({
                "map": params.map
            });
            exposed.addSelector({
                "map": params.map
            });
        },
        clearMapSelection: function(params) { //TODO: Look at renaming function to unselectAll or something like that
            var controls = params.map.getControlsByClass('OpenLayers.Control.SelectFeature');
            controls.forEach(function(control) {
                control.unselectAll();
            });
        },
        broadcastMapExtent: function(params) {
            var mapExtentBounds = params.map.getExtent().transform(params.map.projection, params.map.projectionWGS84);
            publisher.publishExtent({
                "minLon": mapExtentBounds.left,
                "minLat": mapExtentBounds.bottom,
                "maxLon": mapExtentBounds.right,
                "maxLat": mapExtentBounds.top,
                "target": params.target
            });
        },
        trackMousePosition: function(params){
            params.map.events.register('mousemove', params.map, function(e){
                var position = this.events.getMousePosition(e);
                var latlon = exposed.getMouseLocation({
                    "map": params.map,
                    "position": position
                });
                publisher.publishCoordinates({
                    "lat": latlon.lat,
                    "lon": latlon.lon
                });
            });
        },
        getMouseLocation: function(params) {
            return params.map.getLonLatFromPixel(params.position).transform(params.map.projection, params.map.projectionWGS84);
        },
        clearMapPopups: function(params) {
            while(params.map.popups.length) {
                params.map.removePopup(params.map.popups[0]);
            }
        },
        identifyFeature: function(params) {
            var popup,
                feature = params.feature;

            popup = new OpenLayers.Popup.FramedCloud(
                'popup',
                OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                null,
                params.content,
                null,
                true,
                function() {
                    exposed.clearMapSelection({
                        "map": params.map
                    });
                    exposed.clearMapPopups({
                        "map": params.map
                    });
                }
            );

            feature.popup = popup;
            params.map.addPopup(popup);
        }

    };
    return exposed;
});