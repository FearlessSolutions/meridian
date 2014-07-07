define([
    './../map-api-publisher',
    './base',
    './navigation',
    './layers',
    './features',
    './draw',
    './../map/clustering',
    './heatmap',
    './../libs/openlayers-2.13.1/OpenLayers'
], function(
    publisher,
    mapBase,
    mapNavigation,
    mapLayers,
    mapFeatures,
    mapDraw,
    mapClustering,
    mapHeatmap
){
    // Setup context for storing the context of 'this' from the component's main.js 
    var context;

    // Set Full-Scope Variables
    var map,
        basemapLayers = {};

    var exposed = {
        init: function(thisContext) {
            context = thisContext;

            mapBase.init(context);
            mapClustering.init(context);
            mapDraw.init(context);
            mapFeatures.init(context);
            mapHeatmap.init(context);
            mapLayers.init(context);
            mapNavigation.init(context);

            exposed.createMap();
        },
        createMap: function(params) {
            map = mapBase.createMap(params);

            exposed.loadBasemaps({
                "map": map
            });

            mapNavigation.zoomToExtent({
                "map": map,
                "minLon": context.sandbox.mapConfiguration.initialMinLon,
                "minLat": context.sandbox.mapConfiguration.initialMinLat,
                "maxLon": context.sandbox.mapConfiguration.initialMaxLon,
                "maxLat": context.sandbox.mapConfiguration.initialMaxLat
            });

            exposed.setBasemap({
                "map": map,
                "basemap": context.sandbox.mapConfiguration.defaultBaseMap
            });

            mapLayers.createStaticLayers({
                "map": map
            });
            
            context.sandbox.stateManager.map.status.ready = true;
        },
        broadcastMapStatus: function() {

        },
        broadcastMapExtent: function(params) {
            mapBase.broadcastMapExtent({
                "map": map,
                "target": params.target  // TODO: Consider storing through stateManager instead of passing target
            });
        },
        zoomIn: function() {
            mapNavigation.zoomIn({
                "map": map
            });
        },
        zoomOut: function() {
            mapNavigation.zoomOut({
                "map": map
            });
        },
        zoomToExtent: function(params) {
            mapNavigation.zoomToExtent({
                "map": map,
                "minLon": params.minLon,
                "minLat": params.minLat,
                "maxLon": params.maxLon,
                "maxLat": params.maxLat
            });
        },
        zoomToLayer: function(params) {
            mapNavigation.zoomToLayer({
                "map": map,
                "layerId": params.layerId
            });
        },
        setBasemap: function(params) {
            mapLayers.setBasemap({
                "map": map,
                "basemapLayer": basemapLayers[params.basemap]
            });
        },
        loadBasemaps: function() {
            basemapLayers = mapLayers.loadBasemaps({
                "map": map
            });
        },
        setCenter: function(params) {
            mapNavigation.setCenter({
                "map": map,
                "lat": params.lat,
                "lon": params.lon
            });
        },
        drawBBox: function() { // TODO: Make more generic for start drawing
            // create drawLayer
            // start drawing
            mapDraw.startDrawing({
                "map": map,
                "layerId": "static_draw" // should come in params, from component
            });
        },
        removeBBox: function() {
            mapDraw.stopDrawing({
                "map": map,
                "layerId": "static_draw" // should come in params, from component
            });
        },
        createLayer: function(params) { // TODO: look into this more, it is currently always creating a Vector Layer. Channels may need to be more specific.
            var newLayer,
                layerOptions = {
                    "layerId": params.queryId 
                };
            layerOptions.map = map;
            mapClustering.addClusteringToLayerOptions(layerOptions);
            newLayer = mapLayers.createVectorLayer(layerOptions);
            mapLayers.addEventListenersToLayer({
                "map": map,
                "layer": newLayer,
                "eventListeners": params.events //can pass in your own event listeners, or take the default, by not providing any
            });
            // TODO: Layer not added to Data Storage here. Currently, that is done by the data servcie component. Trouble is, that means layers added over this channel wont have storage (toggle layer off doesnt work) 
        },
        plotFeatures: function(params) {
            mapFeatures.plotFeatures({
                "map": map,
                "layerId": params.queryId || params.layerId, // TODO: change params.queryId to params.layerID, this needs to be changed in all components using the channel
                "data": params.data
            });
        },
        plotPoint: function(params) { //TODO: change how the publish args are not in an object, should also call plotFeatures
            mapFeatures.plotFeatures({
                "map": map,
                "layerId": "static_geolocator",
                "data": [params]
            });
        },
        toggleLayer: function(params) {
            // TODO: delete me
        },
        hideLayer: function(params) {
            mapLayers.hideLayer({
                "map": map,
                "layerId": params.layerId
            });
        },
        showLayer: function(params) {
            mapLayers.showLayer({
                "map": map,
                "layerId": params.layerId
            });
        },
        hideAllLayers: function() {  // TODO: consider changing function name to hideAllDataLayers
            mapLayers.hideAllDataLayers({
                "map": map
            });
        },
        changeVisualMode: function(params) {
            mapBase.setVisualMode({
                "map": map,
                "mode": params.mode
            });
            mapLayers.visualModeChanged({
                "map": map,
                "mode": params.mode
            });
        },
        createShapeLayer: function(params) {

        },
        identifyRecord: function(params) {
            mapLayers.identifyFeature({
                "map": map,
                "layerId": params.queryId, // TODO: change payload to use layerId, not queryId
                "featureId": params.recordId
            });
        },
        clearMapSelection: function() {
            mapBase.clearMapSelection({
                "map": map
            });
        },
        clearMapPopups: function() {
            mapBase.clearMapPopups({
                "map": map
            });
        },
        clear: function() {
            mapBase.resetStateManager(); // TODO: what should be reset in state manager (playback bases itself on layers)
            mapBase.resetSelector({
                "map": map
            });
            mapLayers.clear({
                "map": map
            });
            mapLayers.createStaticLayers({
                "map": map
            });
        }

    };
    
    return exposed;
});