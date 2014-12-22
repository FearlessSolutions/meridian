define([

], function() {

  var mapConfiguration = {
    "defaultMapEngine" : "OpenLayers",
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
        "url" : "http://a.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png",
        "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/topographic.png",
        "label" : "OSM Landscape"
      }//,
//      {
//        "basemap" : "grey",
//        "type" : "osm",
//        "url" : "http://korona.geog.uni-heidelberg.de:8008/tms_rg.ashx?x={x}&y={y}&z={z}",
//        "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/grey.png",
//        "label" : "OSM Roads Grey"
//      },
//      {
//        "basemap" : "basic",
//        "type" : "osm",
//        "url" : "http://korona.geog.uni-heidelberg.de:8001/tms_r.ashx?x={x}&y={y}&z={z}",
//        "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/basic.png",
//        "label" : "OSM Roads"
//      },
//      {
//        "basemap" : "imagery",
//        "type" : "wmts",
//        "url" : "http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/WMTS",
//        "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/satellite.png",
//        "label" : "USGS Imagery",
//        "wrapDateLine": true
//      }
    ],
    "markerIcons" : {
      "default" : {
        "icon": "/extensions/map-configuration-extension/images/markerIcons/marker.png",
        "iconLarge": "/extensions/map-configuration-extension/images/markerIcons/marker-2x-80x80.png",
        "height": 24,
        "width": 15,
        "graphicYOffset": -24
      }
    },
    "clustering": {
      "colors": {
        "low":  "rgb(204, 0, 204)",
        "mid":  "rgb(153, 0, 153)",
        "high": "rgb(102, 0, 102"
      },
      "thresholds": {
        "clustering": {"distance": 25, "threshold": 2},
        "noClustering": {"distance": 1, "threshold": Number.MAX_VALUE}
      },
      "symbolizers": {
        "lowSymbolizer": {
          "fillColor": "rgb(204, 0, 204)",
          "fillOpacity": 0.9,
          "strokeColor": "rgb(204, 0, 204)",
          "strokeOpacity": 0.5,
          "strokeWidth": 12,
          "pointRadius": 10,
          "label": "${count}",
          "labelOutlineWidth": 1,
          "labelYOffset": 0,
          "fontColor": "#ffffff",
          "fontOpacity": 0.8,
          "fontSize": "12px"
        },
        "midSymbolizer": {
          "fillColor": "rgb(153, 0, 153)",
          "fillOpacity": 0.9,
          "strokeColor": "rgb(153, 0, 153)",
          "strokeOpacity": 0.5,
          "strokeWidth": 12,
          "pointRadius": 15,
          "label": "${count}",
          "labelOutlineWidth": 1,
          "labelYOffset": 0,
          "fontColor": "#ffffff",
          "fontOpacity": 0.8,
          "fontSize": "12px"
        },
        "highSymbolizer": {
          "fillColor": "rgb(102, 0, 102)",
          "fillOpacity": 0.9,
          "strokeColor": "rgb(102, 0, 102)",
          "strokeOpacity": 0.5,
          "strokeWidth": 12,
          "pointRadius": 20,
          "label": "${count}",
          "labelOutlineWidth": 1,
          "labelYOffset": 0,
          "fontColor": "#ffffff",
          "fontOpacity": 0.8,
          "fontSize": "12px"
        },
        "noClusterSymbolizer": {
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