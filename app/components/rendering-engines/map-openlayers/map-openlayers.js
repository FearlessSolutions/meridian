define([
    './map-openlayers-publisher',
    './clustering/clustering',
    './libs/openlayers-2.13.1/OpenLayers'
], function(publisher, olClustering) {
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    // Set Full-Scope Variables
    var map, 
        selector,
        baselayers = {};

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            if(context.sandbox.mapConfiguration.defaultMapEngine === 'OpenLayers') {
                exposed.createMap();
            }
            if(context.sandbox.mapConfiguration.coordinates && context.sandbox.mapConfiguration.coordinates.startOn){
                exposed.startCoordinates(context.sandbox.mapConfiguration.coordinates);
            }
        },
        getMap: function() {
            return map;
        },
        /**
         * @param args {String} Target of component asking for the current extent.
         * @returns {Object} The current map extent.
         */
        getExtent: function(args) {
            var mapExtentBounds = reprojectTo(map.getExtent());
            publisher.publishExtent({
                "minLon": mapExtentBounds.left,
                "minLat": mapExtentBounds.bottom,
                "maxLon": mapExtentBounds.right,
                "maxLat": mapExtentBounds.top,
                "target": args.target
            });
            return reprojectTo(map.getExtent());
        },
        zoomIn: function() {
            map.zoomIn();
        },
        zoomOut: function() {
            map.zoomOut();
        },
        zoomToLocation: function(params) {
            var bounds = new OpenLayers.Bounds(params.minLon, params.minLat, params.maxLon, params.maxLat);
            map.zoomToExtent(reprojectFrom(bounds),true);
        },
        zoomToLayer: function(params) {
            var queryLayer = map.getLayersBy('layerId', params.layerId + '_bbox')[0];
            if(!queryLayer) {
                queryLayer = map.getLayersBy('layerId', params.layerId)[0];
            }
            map.zoomToExtent(queryLayer.getDataExtent());
        },
        setBasemap: function(params) {
            var basemap = params.basemap;
            map.setBaseLayer(baselayers[basemap]);
        },
        createMap: function(params) {
            var mapElement = (params && params.el) ? params.el : 'map',
                pointLayer;
                
            map = new OpenLayers.Map(mapElement,{
                controls: [new OpenLayers.Control.Navigation()],
                projection: new OpenLayers.Projection(context.sandbox.mapConfiguration.projection),
                projectionWGS84: new OpenLayers.Projection('EPSG:4326')
            });
            exposed.loadBasemaps();

            //Create and add selector
            resetSelector();            

            //Create and add point layer
            pointLayer = new OpenLayers.Layer.Vector('Points', {
                layerId: 'points',
                styleMap: new OpenLayers.StyleMap({
                    externalGraphic: '${icon}',
                    graphicHeight: '${height}',
                    graphicWidth:  '${width}'
                }),
                eventListeners: {
                    beforefeatureselected: function(evt) {
                        exposed.clearMapSelection();
                        exposed.clearMapPopups();
                    },
                    featureselected: function(evt) {
                        var popup,
                            feature = evt.feature;

                        popup = new OpenLayers.Popup.FramedCloud(
                            'popup',
                            OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                            null,
                            toDegreesString(feature.geometry),
                            null,
                            true,
                            function() {
                                exposed.clearMapSelection();
                                exposed.clearMapPopups();
                            }
                        );
                        feature.popup = popup;
                        map.addPopup(popup);
                    },
                    featureunselected: function(evt) {
                        var feature = evt.feature;
                        map.removePopup(feature.popup);
                        feature.popup.destroy();
                        feature.popup = null;
                    }    
                } 
            });
            map.addLayer(pointLayer);
            selector.setLayer([pointLayer]);


            exposed.zoomToLocation({
                minLon: context.sandbox.mapConfiguration.initialMinLon,
                minLat: context.sandbox.mapConfiguration.initialMinLat,
                maxLon: context.sandbox.mapConfiguration.initialMaxLon,
                maxLat: context.sandbox.mapConfiguration.initialMaxLat
            });
            exposed.setBasemap({basemap: context.sandbox.mapConfiguration.defaultBaseMap});


            map.events.register('zoomend', map, function(evt) {
                // Basic cleanup for things on the map when zoom changes... can adjust later as needed
                exposed.clearMapSelection();
                exposed.clearMapPopups();
            });

            context.sandbox.stateManager.map.status.ready = true;
        },
        loadBasemaps: function() {
            context.sandbox.utils.each(context.sandbox.mapConfiguration.basemaps, function(value){
                var olBaseLayer,
                    baseLayerArgs = {};

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
                    baselayers[context.sandbox.mapConfiguration.basemaps[value].basemap] = olBaseLayer;
                    map.addLayer(olBaseLayer);
                }
            });
        },
        setCenter: function(params) {
            var centerPoint,
                lat = params.lat,
                lon = params.lon;

            centerPoint = new OpenLayers.LonLat(lat, lon);
            map.setCenter(reprojectFrom(centerPoint), 8);
        },
        drawBBox: function() {
            var boxLayer,
                boxControl,
                initialVisibility;
            
            if(map.getLayersBy('id', 'drawingBox').length === 0) {
                boxLayer = new OpenLayers.Layer.Vector('drawingBox', {
                    styleMap: new OpenLayers.StyleMap({'default':
                        {
                            fillOpacity: 0.05,
                            strokeOpacity: 1
                        }
                    })
                });
                boxLayer.events.on({
                    'featureadded': function(evt) {
                        var feature = evt.feature;
                        feature.attributes = feature.attributes || {};
                        feature.attributes.box = 'query';
                        bboxAdded({feature: evt.feature});
                        if(boxLayer.features.length > 1) {
                            boxLayer.removeFeatures([boxLayer.features[0]]);
                        }
                    }
                });

                boxLayer.id = 'drawingBox';
                map.addLayers([boxLayer]);
                
                boxControl = new OpenLayers.Control.DrawFeature(boxLayer,
                    OpenLayers.Handler.RegularPolygon, {
                        handlerOptions: {sides: 4, irregular: true}
                    }
                );
                
                boxControl.id = 'queryDrawingControl';
                boxLayer.attributes = boxLayer.attributes || {};
                boxLayer.attributes.name = 'BoxLayer';

                map.addControls([boxControl]);              
                
            } else {
                boxLayer = map.getLayersBy('id', 'drawingBox')[0];
                boxControl = map.getControlsBy('id', 'queryDrawingControl')[0];
            }    
            
            boxControl.activate();

            publisher.publishMessage({
                messageType: 'info',
                messageTitle: 'Drawing',
                messageText: 'Draw a bounding box on the map to gather coordinates.'
            });

            context.$('#map').css('cursor', 'crosshair');

            function bboxAdded(data) {
                var feature,
                    bBoxToString,
                    splitBbs,
                    coords;

                if(data.feature) {
                    feature = data.feature;
                    bBoxToString = reprojectTo(feature.geometry.bounds).toBBOX();
                    splitBbs = bBoxToString.split(',');
                    coords = {
                        minLon: splitBbs[0], 
                        minLat: splitBbs[1],
                        maxLon: splitBbs[2],
                        maxLat: splitBbs[3]
                    };

                    publisher.bboxAdded(coords);
                    
                    boxControl.deactivate();
                    context.$('#map').css('cursor', 'default');
                } else {
                    context.sandbox.logger.log('no feature');
                }
            }
        },
        removeBBox: function() {
            if(map.getLayer('drawingBox')) {
                map.getLayer('drawingBox').removeAllFeatures();
            }
        },
        createLayer: function(params) {
            var layers,
                queryLayer,
                queryLayerObj,
                layerId = params.queryId,
                name = params.name,
                initialVisibility;

            queryLayerObj = {
                layerId: layerId,
                eventListeners: {
                    beforefeatureselected: function(evt) {
                        exposed.clearMapSelection();
                        exposed.clearMapPopups();
                    },
                    featureselected: function(evt) {
                        var popup,
                            infoWinTemplateRef,
                            feature = evt.feature,
                            formattedAttributes = {};

                        if (!feature.cluster){

                            context.sandbox.dataStorage.getFeatureById({"featureId": feature.featureId}, function(fullFeature){
                                infoWinTemplateRef = context.sandbox.dataServices[feature.attributes.dataService].infoWinTemplate;
                                context.sandbox.utils.each(fullFeature.properties,
                                    function(k, v){
                                        if((context.sandbox.utils.type(v) === "string" ||
                                            context.sandbox.utils.type(v) === "number" ||
                                            context.sandbox.utils.type(v) === "boolean")) {
                                            formattedAttributes[k] = v;
                                        }
                                });
                                popup = new OpenLayers.Popup.FramedCloud('popup',
                                    OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                                    null,
                                    infoWinTemplateRef.buildInfoWinTemplate(formattedAttributes),
                                    null,
                                    true,
                                    function() {
                                        exposed.clearMapSelection();
                                        exposed.clearMapPopups();
                                    }
                                );
                                feature.popup = popup;
                                map.addPopup(popup);
                            });
                        } else {
                            var bounds = feature.geometry.getBounds();
                            feature.cluster.forEach(function(point){
                                bounds.extend(point.geometry.getBounds());
                            });
                            var zoom = map.getZoomForExtent(bounds);

                            // To prevent zooming in too far
                            // Sources don't always provide the correct information
                            // as to what levels they have imagery for.
                            //
                            // Clicking a cluster should never zoom the user out.
                            var maxAuto = context.sandbox.mapConfiguration.maxAutoZoomLevel;
                            if (zoom > maxAuto){
                                zoom = map.zoom > maxAuto ? map.zoom : maxAuto;
                                publisher.publishMessage({
                                    messageType: 'warning',
                                    messageTitle: 'Auto Zoom',
                                    messageText: 'Auto zoom is at maximum zoom level. Please use manual zoom for more detail.'
                                });
                            }
                            map.setCenter(bounds.getCenterLonLat(), zoom);
                        }
                    },
                    featureunselected: function(evt) {
                        var feature = evt.feature;
                        if (!feature.cluster){
                            map.removePopup(feature.popup);
                            feature.popup.destroy();
                            feature.popup = null;
                        }
                    }
                }
            };

            context.sandbox.dataStorage.datasets[layerId].visible = true;
            context.sandbox.dataStorage.datasets[layerId].visualMode = 'default';
            context.sandbox.dataStorage.datasets[layerId].isHeated = true;
            olClustering.addClusteringToLayer(queryLayerObj);

            queryLayer = new OpenLayers.Layer.Vector(name || 'Query Layer', queryLayerObj);

            initialVisibility = (context.sandbox.stateManager.map.visualMode === 'heatmap') ? false : true;
            queryLayer.setVisibility(initialVisibility);
            map.addLayer(queryLayer);

            layers = selector.layers;
            layers.push(queryLayer);
            selector.setLayer(layers);

            // Default of new layer is visible = true
            context.sandbox.stateManager.layers[layerId] = {"visible": true};
        },
        plotFeatures: function(params) {
            var args,
                queryId = params.queryId,
                data = params.data,
                newpts = [],
                count = 0,
                queryLayer = map.getLayersBy('layerId', queryId)[0];

            if(queryLayer) {
                context.sandbox.utils.each(data, function(key, value) {
                    count += 1;
                    var newpt = new OpenLayers.Feature.Vector(
                        reprojectFrom(
                            new OpenLayers.Geometry.Point(
                                value.geometry.coordinates[0], 
                                value.geometry.coordinates[1]
                            )
                        )
                    );

                    var iconData = context.sandbox.icons.getIconForFeature(value);
                    newpt.featureId = value.id;
                    newpt.attributes.icon = iconData.icon;
                    newpt.attributes.height = iconData.height;
                    newpt.attributes.width = iconData.width;
                    newpt.attributes.dataService = value.dataService;
                    newpts[key] = newpt;
                });

                queryLayer.addFeatures(newpts);
                queryLayer.recluster();
                queryLayer.refresh({force: true, forces: true});

                args = {
                    queryId: queryId,
                    displayedCountDelta: (map.getLayersBy('layerId', queryId)[0].getVisibility()) ? count : 0, 
                    totalCountDelta: count
                };
            }
        },
        plotPoint: function(params) {
            var pointLayer = map.getLayersBy('layerId', 'points')[0],
                geoJsonParser = new OpenLayers.Format.GeoJSON({
                    ignoreExtraDims: false,
                    internalProjection: new OpenLayers.Projection(map.projection),
                    externalProjection: new OpenLayers.Projection('EPSG:4326') 
                }),
                feature = geoJsonParser.parseFeature(params),
                iconData = context.sandbox.mapConfiguration.markerIcons.default;

            feature.attributes.icon = iconData.icon;
            feature.attributes.height = iconData.height;
            feature.attributes.width = iconData.width;

            pointLayer.addFeatures([feature]);
        },
        toggleLayer: function(params) {
            var layerId = params.layerId,
                layer = map.getLayersBy('layerId', layerId)[0];

            if(layer.getVisibility() === true) {
                exposed.hideLayer({layerId: layerId});
            } else {
                exposed.showLayer({layerId: layerId});
            }
        },
        hideLayer: function(params) {
                exposed.clearMapSelection();
                context.sandbox.utils.each(map.popups, function(key, value) {
                    if(map.popups[key].layerId === params.layerId) {
                        exposed.clearMapPopups();
                    }
                });
                var layer = map.getLayersBy('layerId', params.layerId)[0],
                    layerBox = map.getLayersBy('layerId', params.layerId + '_bbox')[0];
                layer.setVisibility(false);
                if(layerBox) {
                    layerBox.setVisibility(false);
                }
        },
        showLayer: function(params) {
            if(context.sandbox.stateManager.map.visualMode !== 'heatmap') {
                var layer = map.getLayersBy('layerId', params.layerId)[0],
                    layerBox = map.getLayersBy('layerId', params.layerId + '_bbox')[0];
                layer.setVisibility(true);
                if(layerBox) {
                    layerBox.setVisibility(true);
                }
            }
        },
        hideAllLayers: function() {
            //this will iterate through every backbone collection. Each collection is a query layer with the key being the queryId.
            context.sandbox.utils.each(context.sandbox.dataStorage.datasets, function(queryId, collections){
                exposed.hideLayer({layerId: queryId});
            });
        },
        changeVisualMode: function(params){
            if(params && params.mode) {
                context.sandbox.stateManager.map.visualMode = params.mode;
            }

            selector.unselectAll();
            exposed.clearMapPopups();
            if(params.mode === 'heatmap') {
                exposed.hideAllLayers();
            } else {
                // show all the layers that have their state still stored as visible=true
                context.sandbox.utils.each(context.sandbox.stateManager.layers, function(key, value){
                    if(value.visible) {
                        exposed.showLayer({"layerId": key});
                    }
                });
            }
        },
        createShapeLayer: function(params) {
            var vectorLayer,
                proj,
                styleGray,
                poly,
                polygonFeature,
                points = [],
                queryId = params.queryId,
                coords = params.coords,
                initialVisibility;

            vectorLayer = new OpenLayers.Layer.Vector(queryId + '_bbox', {
                layerId: queryId + '_bbox',
                layerType: 'bbox'
            });

            // hide bbox layer, if created during heatmap mode
            initialVisibility = (context.sandbox.stateManager.map.visualMode === 'heatmap') ? false : true;
            vectorLayer.setVisibility(initialVisibility);

            map.addLayer(vectorLayer);
            styleGray = {
                strokeColor: '#000',
                strokeOpacity: 0.3,
                strokeWidth: 2,
                fillColor: 'gray',
                fillOpacity: 0.3
            };
            points.push(reprojectFrom(new OpenLayers.Geometry.Point(coords.minLon, coords.maxLat)));
            points.push(reprojectFrom(new OpenLayers.Geometry.Point(coords.maxLon, coords.maxLat)));
            points.push(reprojectFrom(new OpenLayers.Geometry.Point(coords.maxLon, coords.minLat)));
            points.push(reprojectFrom(new OpenLayers.Geometry.Point(coords.minLon, coords.minLat)));
            poly = new OpenLayers.Geometry.LinearRing(points);
            polygonFeature = new OpenLayers.Feature.Vector(poly, null, styleGray);
            vectorLayer.addFeatures([polygonFeature]);
        },
        identifyRecord: function(params) {
            var zoom,
                popup,
                bounds,
                identifiedCluster,
                record,
                headerHTML,
                clusterRecordID,
                currentFeatureId,
                currentDataService,
                infoWinTemplateRef,
                clusterFeatureCount,
                isCluster = false,
                formattedAttributes = {},
                fullFeature;

            var feature = map.getLayersBy('layerId', params.queryId)[0].getFeatureBy('featureId', params.recordId);
            context.sandbox.utils.each(map.getLayersBy('layerId', params.queryId)[0].features, function(k1, v1) {
                if(v1.cluster) {
                    context.sandbox.utils.each(v1.cluster, function(k2, v2) {
                        if(params.recordId === v2.featureId) {
                            isCluster = true;
                            feature = v1;
                            record = v2;
                            clusterRecordID = k2 + 1;
                            clusterFeatureCount = feature.cluster.length;
                        }
                    });
                }
            });
            
            if(isCluster){
                currentFeatureId = feature.cluster[0].featureId;
                currentDataService = record.attributes.dataService;
            } else {
                currentFeatureId = feature.featureId;
                currentDataService = feature.attributes.dataService;
            }

            headerHTML = '<span>' + clusterRecordID + ' of ' + clusterFeatureCount + '</span>';
			context.sandbox.dataStorage.getFeatureById({"featureId": currentFeatureId}, function(fullFeature) {
                infoWinTemplateRef = context.sandbox.dataServices[currentDataService].infoWinTemplate;
                context.sandbox.utils.each(fullFeature.properties,
                    function(k, v){
                    if((context.sandbox.utils.type(v) === "string" ||
                        context.sandbox.utils.type(v) === "number" ||
                        context.sandbox.utils.type(v) === "boolean")) {
                        formattedAttributes[k] = v;
                    }
                });
                popup = new OpenLayers.Popup.FramedCloud('popup',
                    OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                    null,
                    headerHTML + infoWinTemplateRef.buildInfoWinTemplate(formattedAttributes),
                    null,
                    true,
                    function() {
                        exposed.clearMapSelection();
                        exposed.clearMapPopups();
                    }
                );
                popup.layerId = params.queryId;
                
                exposed.clearMapSelection();
                exposed.clearMapPopups();

                if(!isCluster) {
                    if(feature) {
                        selector.select(feature);
                    } else {
                        context.sandbox.logger.error('Feature does not exist on map.');
                    }
                } else {
                    console.warn(feature);
                    bounds = feature.geometry.getBounds();
                    map.setCenter(bounds.getCenterLonLat());

                    feature.popup = popup;
                    map.addPopup(popup);
                }
            });
        },
        clearMapSelection: function() {
            try{
                selector.unselectAll();
            }
            catch(e){}
        },
        clearMapPopups: function() {
            while(map.popups.length) {
                map.removePopup(map.popups[0]);
            }
        },
        startCoordinates: function(params){
            map.events.register('mousemove', map, function(e){
                var position = this.events.getMousePosition(e),
                    latlon = reprojectTo(map.getLonLatFromPixel(position));
                publisher.publishCoordinates({
                    "lat": latlon.lat,
                    "lon": latlon.lon
                });
            });
        },
        clear: function() {
            //Remove only the feature layers; keep the base layers
            //Make sure to keep this up-to-date with layers that should not be removed.
            exposed.removeBBox();
            exposed.clearMapPopups();
            var layers = map.getLayersByClass('OpenLayers.Layer.Vector'),
                controls = map.getControlsByClass('OpenLayers.Control.SelectFeature');

            controls.forEach(function(control){
                control.destroy();
            });

            layers.forEach(function(layer){
                if(layer.attributes && layer.attributes.name === 'BoxLayer'){
                    return;
                }else if(layer.layerId === 'points'){
                    layer.destroyFeatures(); //Don't remove the layer, just the features
                }else{
                    layer.destroy();
                }                
            });     

            resetSelector();
            selector.setLayer(map.getLayersBy('layerId', 'points'));

            context.sandbox.stateManager.layers = {};
        }
    };

    function reprojectTo(geom) {
        // transform from map projection to display projection (not too useful)
        return geom.transform(map.projection, map.projectionWGS84);
    }

    function reprojectFrom(geom) {
        // transform from display projection to map projection (not too useful)
        return geom.transform(map.projectionWGS84, map.projection);
    }

    /**
     * Convert geometry to degrees, returns short string
     * Gets around geometry.transform() changing the object value
     */
    function toDegreesString(geom) {
        var clone = geom.clone();
        return clone.transform(map.projection, map.projectionWGS84).toShortString();
    }

    /**
     * Clear all map selector controls
     * Create a new one, and attach it to the map
     */
    function resetSelector(){
        var controls = map.getControlsByClass('OpenLayers.Control.SelectFeature');
        controls.forEach(function(control){
            control.destroy();
        });

        selector = new OpenLayers.Control.SelectFeature([], {
            click:true,
            autoActivate:true
        });

        map.addControl(selector);
    }

    return exposed;
});