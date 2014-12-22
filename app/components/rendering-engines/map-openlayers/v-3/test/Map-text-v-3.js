var baseLayer = new ol.layer.Tile({
    name: 'test',
    source: new ol.source.OSM({
        url: 'http://a.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png'
    })
});


var map = new ol.Map({
    layers: [baseLayer],
    target: 'map',
    view: new ol.View({
        center: [0,0],
        zoom: 2
    })
//                    controls: [new ol.control.zoom()],
//    projection: new ol.proj.Projection({
//        code: context.sandbox.mapConfiguration.projection
//    }),
//    projectionWGS84: new ol.proj.Projection({
//        code: 'EPSG:4326'
//    })
});