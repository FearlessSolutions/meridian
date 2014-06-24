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
        selector,
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

            basemapLayers = mapBase.loadBasemaps({
                "map": map
            });

            mapNavigation.zoomToExtent({
                "map": map,
                "minLon": context.sandbox.mapConfiguration.initialMinLon,
                "minLat": context.sandbox.mapConfiguration.initialMinLat,
                "maxLon": context.sandbox.mapConfiguration.initialMaxLon,
                "maxLat": context.sandbox.mapConfiguration.initialMaxLat
            });

            mapBase.setBasemap({
                "map": map,
                "basemapLayer": basemapLayers[context.sandbox.mapConfiguration.defaultBaseMap]
            });

            // call stuff for selector
            //mapBase.resetSelector();

            // call stuff for pointlayer
            //mapBase.createPoinLayer();
            //var clone = geom.clone();
            //return clone.transform(map.projection, map.projectionWGS84).toShortString
            
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
            mapBase.setBasemap({
                "map": map,
                "basemapLayer": basemapLayers[params.basemap]
            });
        },
        loadBasemaps: function() {
            basemapLayers = mapBase.loadBasemaps({
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
        drawBBox: function() {

        },
        removeBBox: function() {

        },
        createLayer: function(params) {

        },
        plotFeatures: function(params) {

        },
        plotPoint: function(params) {

        },
        toggleLayer: function(params) {

        },
        hideLayer: function(params) {

        },
        showLayer: function(params) {

        },
        hideAllLayers: function() {

        },
        changeVisualMode: function(params) {
            // enableClustering, disableClustering, addClusteringToLayer, updateHeatmap
        },
        createShapeLayer: function(params) {

        },
        identifyRecord: function(params) {

        },
        clearMapSelection: function() {

        },
        clearMapPopups: function() {

        },
        clear: function() {
            // clear mapcore, heatmap, clustering
        }

    };
    
    return exposed;
});