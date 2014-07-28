define([
], function() { 
    var pubConfiguration = {
        "channels":{
            "map.overlay.create":{
                valid:true,
                sample: {
                    "name": "Test Name 1",
                    "overlayId": "testOverlayId1",
                    "coords": {
                        "minLat": "7.602108",
                        "minLon": "-13.908691",
                        "maxLat": "11.587669",
                        "maxLon": "-8.283691"
                    },
                    "symbolizers": {
                        "lowSymbolizer": {
                            "fillColor": "rgb(0, 0, 0)",
                            "fillOpacity": 0.9,
                            "strokeColor": "rgb(0, 0, 0)",
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
                            "fillColor": "rgb(0, 0, 0)",
                            "fillOpacity": 0.9,
                            "strokeColor": "rgb(0, 0, 0)",
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
                            "fillColor": "rgb(0, 0, 0)",
                            "fillOpacity": 0.9,
                            "strokeColor": "rgb(0, 0, 0)",
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
                }
            },
            "map.overlay.remove":{
                valid: true,
                sample: {
                    "overlayId": "testOverlayId1"
                }
            },
            "map.overlay.hide":{
                valid: true,
                sample: {
                    "overlayId": "testOverlayId1"
                }
            },
            "map.overlay.show":{
                valid: true,
                sample: {
                    "overlayId": "testOverlayId1"
                }
            },
            "map.feature.plot":{
                valid: true,
                sample: {
                    "overlayId":"testOverlayId1",
                    "name":"Test Name 1",
                    "format":"geojson",
                    "feature":{
                        "type":"FeatureCollection",
                        "features":[
                            {
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [0.0, 10.0]
                                },
                                "properties": {
                                    "featureId": "f1"
                                }
                            }
                        ]
                    },
                    "zoom":"true",
                    "readOnly":"false",
                    "symbolizers": {
                        "lowSymbolizer": {
                            "fillColor": "rgb(0, 0, 0)",
                            "fillOpacity": 0.9,
                            "strokeColor": "rgb(0, 0, 0)",
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
                            "fillColor": "rgb(0, 0, 0)",
                            "fillOpacity": 0.9,
                            "strokeColor": "rgb(0, 0, 0)",
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
                            "fillColor": "rgb(0, 0, 0)",
                            "fillOpacity": 0.9,
                            "strokeColor": "rgb(0, 0, 0)",
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
                }
            },
            "map.view.zoom":{
                "valid": true
            },
            "map.view.center.overlay":{
                "valid": true,
                "sample": {
                    "overlayId": "testOverlayId1"
                }
            },
            "map.view.center.feature":{
                "valid": true,
                "sample": {
                    "featureId": "f1"
                }
            },
            "map.view.center.location":{
                "valid": true,
                "sample": {
                    "location": {
                        "lat": 30,
                        "lon": 30

                    }
                }
            },
            "map.view.center.bounds":{ //TODO support zoom, or just best fit?
                "valid": true,
                "sample": {
                    "bounds": {
                        "southWest":{
                            "lat": 24.5,
                            "lon": -124
                        },
                        "northEast": {
                            "lat": 50.5,
                            "lon": -79
                        }

                    }
                }
            }
        }
    };

    return pubConfiguration;
});