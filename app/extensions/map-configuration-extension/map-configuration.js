define([

], function() {

    var mapConfiguration = {
        defaultMapEngine : 'OpenLayers',
        defaultBaseMap: 'landscape',//Must be a valid name in basemaps.
        initialMinLat: -16.341225619207417,
        initialMinLon: -31.640624999999773,
        initialMaxLat: 16.341225619207417,
        initialMaxLon: 31.640624999999773,
        maxAutoZoomLevel: 13,
        projection: 'EPSG:900913',
        defaultVisualMode: 'cluster',
        defaultTileWidth: 256,
        defaultTileHeight: 256,
        CLUSTER_MODE: 'cluster',
        FEATURE_MODE: 'feature',
        HEAT_MODE: 'heatmap',
        AOI_TYPE: 'aoi',
        STATIC_TYPE: 'static',
        LAYERID_SUFFIX: '_cluster',
        GEOLOCATOR_LAYERID: 'static_geolocator',
        basemaps : [
            {
                basemap : 'landscape',
                type : 'osm',
                url : 'http://a.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png',
                thumbnail : '/extensions/map-configuration-extension/images/basemaps/topographic.png',
                label : 'OSM Landscape'
            },
//      {
//        basemap : 'grey',
//        type : 'osm',
//        url : 'http://korona.geog.uni-heidelberg.de:8008/tms_rg.ashx?x={x}&y={y}&z={z}',
//        thumbnail : '/extensions/map-configuration-extension/images/basemaps/grey.png',
//        label : 'OSM Roads Grey'
//      },
//      {
//        basemap : 'basic',
//        type : 'osm',
//        url : 'http://korona.geog.uni-heidelberg.de:8001/tms_r.ashx?x={x}&y={y}&z={z}',
//        thumbnail : '/extensions/map-configuration-extension/images/basemaps/basic.png',
//        label : 'OSM Roads'
//      },
//      {
//        basemap : 'imagery',
//        type : 'wmts',
//        url : 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/WMTS',
//        thumbnail : '/extensions/map-configuration-extension/images/basemaps/satellite.png',
//        label : 'USGS Imagery',
//        wrapDateLine: true
//      }//,
            {
                basemap : 'imagery',
                type : 'wmts',
                url : 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/WMTS',
                thumbnail : '/extensions/map-configuration-extension/images/basemaps/satellite.png',
                label : 'USGS Imagery',
                wrapDateLine: true,
                projection: 'EPSG:3857',
                projectionExtent: [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
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
            }//,
//        {
//            basemap: 'population',
//            type: 'wmts',
//            thumbnail : '/extensions/map-configuration-extension/images/basemaps/satellite.png',
//            label : 'USpopulation density',
//            projection: 'EPSG:3857',
//            projectionExtent: [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
//            url: 'http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/WMTS/',
//            matrixSet: 'EPSG:3857',
//            format: 'image/png',
//            resolutions: [
//                156543.03392804097,
//                78271.51696402048,
//                39135.75848201024,
//                19567.87924100512,
//                9783.93962050256,
//                4891.96981025128,
//                2445.98490512564,
//                1222.99245256282,
//                611.49622628141,
//                305.748113140705,
//                152.8740565703525,
//                76.43702828517625,
//                38.21851414258813,
//                19.109257071294063
//            ],
//            matrixIds: [
//                0,
//                1,
//                2,
//                3,
//                4,
//                5,
//                6,
//                7,
//                8,
//                9,
//                10,
//                11,
//                12,
//                13
//            ],
//            origin: [-20037508.342789244, 20037508.342789244]
//        }
        ],
        markerIcons : {
            default : {
                icon: '/extensions/map-configuration-extension/images/markerIcons/marker.png',
                iconLarge: '/extensions/map-configuration-extension/images/markerIcons/marker-2x-80x80.png',
                height: 24,
                width: 15,
                graphicYOffset: -24
            },
            selectedDefault : {
                icon: '/extensions/map-configuration-extension/images/markerIcons/cat.jpg',
                height: 24,
                width: 15,
                graphicYOffset: -24
            }
        },
        clustering: {
            colors: {
                low:  'rgb(204, 0, 204)',
                mid:  'rgb(153, 0, 153)',
                high: 'rgb(102, 0, 102'
            },
            thresholds: {
                clustering: {distance: 25, threshold: 2},
                noClustering: {distance: 1, threshold: Number.MAX_VALUE}
            },
            symbolizers: {
                lowSymbolizer: {
                    fillColor: 'rgb(204, 0, 204)',
                    fillOpacity: 0.9,
                    strokeColor: 'rgb(204, 0, 204)',
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 10,
                    label: '${count}',
                    labelOutlineWidth: 1,
                    labelYOffset: 0,
                    fontColor: '#ffffff',
                    fontOpacity: 0.8,
                    fontSize: '12px'
                },
                midSymbolizer: {
                    fillColor: 'rgb(153, 0, 153)',
                    fillOpacity: 0.9,
                    strokeColor: 'rgb(153, 0, 153)',
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 15,
                    label: '${count}',
                    labelOutlineWidth: 1,
                    labelYOffset: 0,
                    fontColor: '#ffffff',
                    fontOpacity: 0.8,
                    fontSize: '12px'
                },
                highSymbolizer: {
                    fillColor: 'rgb(102, 0, 102)',
                    fillOpacity: 0.9,
                    strokeColor: 'rgb(102, 0, 102)',
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 20,
                    label: '${count}',
                    labelOutlineWidth: 1,
                    labelYOffset: 0,
                    fontColor: '#ffffff',
                    fontOpacity: 0.8,
                    fontSize: '12px'
                },
                noClusterSymbolizer: {
                    externalGraphic: '${icon}',
                    graphicOpacity: 1,
                    pointRadius: 15,
                    graphicHeight: '${height}',
                    graphicWidth: '${width}'
                }
            }
        },
        basemapGalleryMaxHeight: '40%',
        cursorLocation: {
            defaultDisplay: true
        }
    };

    return mapConfiguration;

});