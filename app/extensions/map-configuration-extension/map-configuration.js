define([

], function() {

    var mapConfiguration = {
        "defaultMapEngine" : "Leaflet",
        "defaultBaseMap": "landscape",//Must be a valid name in basemaps.
        "initialMinLat": -16.341225619207417,
        "initialMinLon": -31.640624999999773,
        "initialMaxLat": 16.341225619207417,
        "initialMaxLon": 31.640624999999773,
        "maxAutoZoomLevel": 13,
        "projection": "EPSG:900913",
        "defaultVisualMode": "cluster",
        "defaultTileWidth": 256,
        "defaultTileHeight": 256,
        "basemaps" : [
            {
                "basemap" : "landscape",
                "type" : "osm",
                "url" : "http://a.tile3.opencyclemap.org/landscape/${z}/${x}/${y}.png",
                "leafUrl": "http://a.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png",
                "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/topographic.png",
                "label" : "OSM Landscape"
            },
            {
                "basemap" : "grey",
                "type" : "osm",
                "url" : "http://korona.geog.uni-heidelberg.de:8008/tms_rg.ashx?x=${x}&y=${y}&z=${z}",
                "leafUrl" : "http://korona.geog.uni-heidelberg.de:8008/tms_rg.ashx?x={x}&y={y}&z={z}",
                "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/grey.png",
                "label" : "OSM Roads Grey"
            },
            {
                "basemap" : "basic",
                "type" : "osm",
                "url" : "http://korona.geog.uni-heidelberg.de:8001/tms_r.ashx?x=${x}&y=${y}&z=${z}",
                "leafUrl" : "http://korona.geog.uni-heidelberg.de:8001/tms_r.ashx?x={x}&y={y}&z={z}",
                "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/basic.png",
                "label" : "OSM Roads"
            },
            {
                "basemap" : "imagery",
                "type" : "wmts",
                "url" : "http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/WMTS",
                "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/satellite.png",
                "label" : "USGS Imagery",
                "wrapDateLine": true
            }
        ],
        "shapeStyles": {
            "rectangle":{
                "shapeOptions":{
                    "color": '#000000',
                    "fillColor": '#8b8a8a',
                    "fillOpacity": 0.3,
                    "clickable": false,
                    "weight": 1
                }
            },
            "circle":{}
        },
        "markerIcons" : {
            "default" : {
                "icon": "/extensions/map-configuration-extension/images/markerIcons/marker_24x24.png",
                "iconLarge": "/extensions/map-configuration-extension/images/markerIcons/marker_128x128.png",
                "height": 24,
                "width": 24,
                "graphicYOffset": -24,
                "iconAnchor": [12,24],/*Image is added using the top left corner. Ancho is half the width and the entire height*/
                "popupAnchor": [0, -12]/*Popup appears on the exact point. Move it in relation to the */
            }
        },
        clustering: {
            "colors": {
                "low":  "rgb(204, 0, 204)",
                "mid":  "rgb(153, 0, 153)",
                "high": "rgb(102, 0, 102"
            },
            "thresholds": {
                "clustering": {"distance": 25, "threshold": 2},
                "noClustering": {"distance": 1, "threshold": Number.MAX_VALUE}
            },
            "styleMap": {
                "small": {
                    stroke: {
                        "background-color": "orange",
                        "opacity": ".6",
                        "width": "35px",
                        "height": "35px",
                        "top": "-11px",
                        "left": "-11px"
                    },
                    fill: {
                        "background-color": "salmon",
                        "height": "25px",
                        "width": "25px",
                        "top": "-41px",
                        "left": "-6px",
                        "line-height": "24px",
                        "font-weight": "bold",
                        "font-size": "14px",
                        "color":"blue"
                    }
                },
                "medium": {
                    stroke: {
                        "background-color": "darkcyan",
                        "opacity": ".6",
                        "width": "40px",
                        "height": "40px",
                        "top": "-13px",
                        "left": "-13px"
                    },
                    fill: {
                        "background-color": "cyan",
                        "height": "28px",
                        "width": "28px",
                        "top": "-47px",
                        "left": "-7px",
                        "line-height": "25px",
                        "font-weight": "bold",
                        "font-size": "14px",
                        "color": "blue"
                    }
                },
                "large": {
                    stroke: {
                        "background-color": "green",
                        "opacity": ".6",
                        "width": "44px",
                        "height": "44px",
                        "top": "-16px",
                        "left": "-15px"
                    },
                    fill: {
                        "background-color": "greenyellow",
                        "height": "34px",
                        "width": "34px",
                        "top": "-55px",
                        "left": "-10px",
                        "line-height": "33px",
                        "font-weight": "bold",
                        "font-size": "14px",
                        "color": "blue"
                    }
                },
                "point": {
                    "externalGraphic": "${icon}",
                    "graphicOpacity": 1,
                    "pointRadius": 15,
                    "graphicHeight": "${height}",
                    "graphicWidth": "${width}"
                }
            }
        },
        "basemapGalleryMaxHeight": "40%",
        "cursorLocation": {
            "defaultDisplay": true
        }
    };

    return mapConfiguration;

});