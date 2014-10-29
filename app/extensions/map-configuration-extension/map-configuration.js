define([

], function() {

/**
 * @namespace Sandbox.mapConfiguration
 * @namespcace Sandbox
 * 
 * @property {String} defaulMapEngine                             - Default map renderer.
 * @property {String} defaultBaseMap                              - Default map tile service. Must be a valid name found in the basemaps array.
 * @property {Number} initialMinLat                               - Minimum Latitude used in the initial extent.
 * @property {Number} initialMinLon                               - Minimum Longitude used in the initial extent.
 * @property {Number} initialMaxLat                               - Maximum Latitude used in the initial extent.
 * @property {Number} initialMaxLon                               - Maximum Longitude used in the initial extent.
 * @property {Number} maxAutoZoomLevel                            - Maximum zoom level allowed.
 * @property {String} projection                                  - Spatial reference.
 * @property {String} defaultVisualMode                           - Default visual mode.
 * @property {Number} defaultTileWidth                            - Default Tile width.
 * @property {Number} defaultTileHeight                           - Default Tile height.
 * 
 * @property {Array}  basemaps                                    - Array of tile service Objects.
 * @property {String} basemaps.basemap                            - Name of the basemap tile service.
 * @property {String} basemaps.type                               - Type of the map tile service.
 * @property {String} basemaps.url                                - URL of the map tile service.
 * @property {String} basemaps.thumbnail                          - URL for the image used in basemap gallery component.
 * @property {String} basemaps.label                              - Name used for tooltips.
 * 
 * @property {Object} markerIcons                                 - Collection of map marker settings.
 * @property {Object} markerIcons.default                         - Settings for default map markers.
 * @property {String} markerIcons.default.icon                    - URL of the small marker. 
 * @property {String} markerIcons.default.iconLarge               - URL of the large marker.
 * @property {Number} markerIcons.default.height                  - Height of the marker.
 * @property {Number} markerIcons.default.width                   - Width of the marker.
 * @property {Number} markerIcons.default.graphicYOffset          - Pixel offset along the positive y axis for displacing the marker icon.
 * 
 * @property {Object} clustering                                  - Clustering Settings.
 * @property {Object} clustering.colors                           - Color settings for clustering.
 * @property {String} clustering.colors.low                       - RBG color for the low threshold.
 * @property {String} clustering.colors.mid                       - RBG color for the mid threshold.
 * @property {String} clustering.colors.high                      - RBG color for the high threshold.
 * 
 * @property {Object} thresholds                                  - Threshold settings for the clustering strategy. OpenLayers always applies the strategy.
 * @property {Object} thresholds.clustering                       - Cluster threshold settings.
 * @property {Number} thresholds.clustering.distance              - Pixel distance between features that should be considered a single cluster.
 * @property {Number} thresholds.clustering.threshold             - Minimum amount of points needed inside the pixel radius to create a cluster.
 * @property {Object} thresholds.noClustering                     - No-clustering threshold settings. Since the cluster strategy is always applied in the renderer, these properties have specific values so it behaves like single points instead of clusters.
 * @property {Number} thresholds.noClustering.distance            - Pixel distance between features that should be considered a single cluster.
 * @property {Number} thresholds.noClustering.threshold           - Minimum amount of points needed inside the pixel radius to create a cluster. Value set to Number.MAX_VALUE, meaning they should not cluster. 
 *                                                                
 * @property {Object} symbolizers                                 - Symbolizer settings.
 * @property {Object} symbolizers.lowSymbolizer                   - Symbolizer settings for the low threshold.
 * @property {String} symbolizers.lowSymbolizer.fillColor         - RGB hex fill color that matches the clustering.colors.low value. (Inner part of the cluster).
 * @property {Number} symbolizers.lowSymbolizer.fillOpacity       - Fill opacity (0-1).
 * @property {String} symbolizers.lowSymbolizer.strokeColor       - Color for line stroke that matches the clustering.colors.low value. (Outer rim of the cluster).
 * @property {Number} symbolizers.lowSymbolizer.strokeOpacity     - Stroke opacity (0-1).
 * @property {Number} symbolizers.lowSymbolizer.strokeWidth       - Pixel stroke width.
 * @property {Number} symbolizers.lowSymbolizer.pointRadius       - Pixel point radius.
 * @property {String} symbolizers.lowSymbolizer.label             - Text of the point.
 * @property {Number} symbolizers.lowSymbolizer.labelOutlineWidth - Pixel outline width.
 * @property {Number} symbolizers.lowSymbolizer.labelYOffset      - Pixel offset along the positive y axis for label displacement.
 * @property {String} symbolizers.lowSymbolizer.fontColor         - Color applied to the label.
 * @property {Number} symbolizers.lowSymbolizer.fontOpacity       - Font opacity (0-1).
 * @property {String} symbolizers.lowSymbolizer.fontSize          - Font size for the label.
 * 
 * @property {Object} symbolizers.midSymbolizer                   - Symbolizer settings for the mid threshold.
 * @property {String} symbolizers.midSymbolizer.fillColor         - RGB hex fill color that matches the clustering.colors.mid value. (Inner part of the cluster).
 * @property {Number} symbolizers.midSymbolizer.fillOpacity       - Fill opacity (0-1).
 * @property {String} symbolizers.midSymbolizer.strokeColor       - Color for line stroke that matches the clustering.colors.mid value. (Outer rim of the cluster).
 * @property {Number} symbolizers.midSymbolizer.strokeOpacity     - Stroke opacity (0-1).
 * @property {Number} symbolizers.midSymbolizer.strokeWidth       - Pixel stroke width.
 * @property {Number} symbolizers.midSymbolizer.pointRadius       - Pixel point radius.
 * @property {String} symbolizers.midSymbolizer.label             - Text of the point.
 * @property {Number} symbolizers.midSymbolizer.labelOutlineWidth - Pixel outline width.
 * @property {Number} symbolizers.midSymbolizer.labelYOffset      - Pixel offset along the positive y axis for label displacement.
 * @property {String} symbolizers.midSymbolizer.fontColor         - Color applied to the label.
 * @property {Number} symbolizers.midSymbolizer.fontOpacity       - Font opacity (0-1).
 * @property {String} symbolizers.midSymbolizer.fontSize          - Font size for the label.     
 *
 * @property {Object} symbolizers.highSymbolizer                   - Symbolizer settings for the high threshold.
 * @property {String} symbolizers.highSymbolizer.fillColor         - RGB hex fill color that matches the clustering.colors.high value. (Inner part of the cluster).
 * @property {Number} symbolizers.highSymbolizer.fillOpacity       - Fill opacity (0-1).
 * @property {String} symbolizers.highSymbolizer.strokeColor       - Color for line stroke that matches the clustering.colors.high value. (Outer rim of the cluster).
 * @property {Number} symbolizers.highSymbolizer.strokeOpacity     - Stroke opacity (0-1).
 * @property {Number} symbolizers.highSymbolizer.strokeWidth       - Pixel stroke width.
 * @property {Number} symbolizers.highSymbolizer.pointRadius       - Pixel point radius.
 * @property {String} symbolizers.highSymbolizer.label             - Text of the point.
 * @property {Number} symbolizers.highSymbolizer.labelOutlineWidth - Pixel outline width.
 * @property {Number} symbolizers.highSymbolizer.labelYOffset      - Pixel offset along the positive y axis for label displacement.
 * @property {String} symbolizers.highSymbolizer.fontColor         - Color applied to the label.
 * @property {Number} symbolizers.highSymbolizer.fontOpacity       - Font opacity (0-1).
 * @property {String} symbolizers.highSymbolizer.fontSize          - Font size for the label.  
 *
 * @property {Object} symbolizers.noClusterSymbolizer                 - Symbolizer settings for no cluster.
 * @property {String} symbolizers.noClusterSymbolizer.externalGraphic - URL to an external graphic that will be used for rendering points.
 * @property {String} symbolizers.noClusterSymbolizer.graphicOpacity  - Opacity (0-1) for the external graphic.
 * @property {String} symbolizers.noClusterSymbolizer.pointRadius     - Pixel point radius.
 * @property {String} symbolizers.noClusterSymbolizer.graphicHeight   - Pixel height for sizing the external graphic.
 * @property {String} symbolizers.noClusterSymbolizer.graphicWidth    - Pixel width for sizing the external graphic.
 *
 * @property {String} basemapGalleryMaxHeight                         - Max height for the basemap gallery.
 * 
 * @property {Object}  cursorLocation                                 - Settings for the cursor location component.
 * @property {Boolean} cursorLocation.defaultDisplay                  - If the component will be displayed.
 *
 */
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
        "url" : "http://a.tile3.opencyclemap.org/landscape/${z}/${x}/${y}.png",
        "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/topographic.png",
        "label" : "OSM Landscape"
      },
      {
        "basemap" : "grey",
        "type" : "osm",
        "url" : "http://korona.geog.uni-heidelberg.de:8008/tms_rg.ashx?x=${x}&y=${y}&z=${z}",
        "thumbnail" : "/extensions/map-configuration-extension/images/basemaps/grey.png",
        "label" : "OSM Roads Grey"
      },
      {
        "basemap" : "basic",
        "type" : "osm",
        "url" : "http://korona.geog.uni-heidelberg.de:8001/tms_r.ashx?x=${x}&y=${y}&z=${z}",
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
        "clustering": {"distance":25, "threshold": 2},
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