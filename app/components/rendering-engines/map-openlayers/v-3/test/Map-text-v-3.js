var baseLayer = new ol.layer.Tile({
    name: 'test',
    source: new ol.source.OSM({
        url: 'http://korona.geog.uni-heidelberg.de:8008/tms_rg.ashx?x={x}&y={y}&z={z}'
    })
});


//var map = new ol.Map({
//    layers: [baseLayer],
//    target: 'map',
//    view: new ol.View({
//        center: [0,0],
//        zoom: 2
//    })
//
//
////                    controls: [new ol.control.zoom()],
////    projection: new ol.proj.Projection({
////        code: context.sandbox.mapConfiguration.projection
////    }),
////    projectionWGS84: new ol.proj.Projection({
////        code: 'EPSG:4326'
////    })
//});


createMap();

function createMap(){
    var params = {
        basemap: "population",
        type: 'wmts',
        "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/satellite.png",
        "label" : "USpopulation density",
        projection: 'EPSG:3857',
        projectionExtent: [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
//        url: 'http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS/',
        url: 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/WMTS',
        matrixSet: 'EPSG:3857',
        format: 'image/png',
        resolutions: [
            156543.03392804097,
            78271.51696402048,
            39135.75848201024,
            19567.87924100512,
            9783.93962050256,
            4891.96981025128,
            2445.98490512564,
            1222.99245256282,
            611.49622628141,
            305.748113140705,
            152.8740565703525,
            76.43702828517625,
            38.21851414258813,
            19.109257071294063
        ],
        matrixIds: [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13
        ],
        origin: [-20037508.342789244, 20037508.342789244]
    };

    var map = new ol.Map({
        layers: [
//            new ol.layer.Tile({
//                source: new ol.source.OSM(),
//                opacity: 0.7
//            }),
            new ol.layer.Tile({
                opacity: 0.7,
//            extent: projectionExtent,
                source: new ol.source.WMTS({
//                attributions: [attribution],
                    url: params.url,
//                    layer: '0',
                    matrixSet: params.matrixSet,
                    format: params.format,
                    projection: ol.proj.get(params.projection),
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: params.origin,
                        resolutions: params.resolutions,
                        matrixIds: params.matrixIds
                    }),
                    style: 'default'
                })
            })
        ],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        view: new ol.View({
            center: [-11158582, 4813697],
            zoom: 4
        })
    });
}
