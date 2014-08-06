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
                            "externalGraphic": "/cmapi/payloads/images/customCluster.png",
                            "fontColor": "rgb(130, 37, 251)",
                            "fontOpacity": 1,
                            "fontSize": "12",
                            "fontWeight": "bold",
                            "graphicHeight": 36,
                            "graphicOpacity": 1,
                            "graphicWidth": 36,
                            "label": "${count}",
                            "labelOutlineWidth": 3,
                            "labelYOffset": 5,
                            "pointRadius": 10
                        },
                        "midSymbolizer": {
                            "externalGraphic": "/cmapi/payloads/images/customCluster.png",
                            "fontColor": "rgb(130, 37, 251)",
                            "fontOpacity": 1,
                            "fontSize": "13",
                            "fontWeight": "bold",
                            "graphicHeight": 48,
                            "graphicOpacity": 1,
                            "graphicWidth": 48,
                            "label": "${count}",
                            "labelOutlineWidth": 3,
                            "labelYOffset": 0,
                            "pointRadius": 15
                        },
                        "highSymbolizer": {
                            "externalGraphic": "/cmapi/payloads/images/customCluster.png",
                            "fontColor": "rgb(130, 37, 251)",
                            "fontOpacity": 1,
                            "fontSize": "14",
                            "fontWeight": "bold",
                            "graphicHeight": 60,
                            "graphicOpacity": 1,
                            "graphicWidth": 60,
                            "label": "${count}",
                            "labelOutlineWidth": 3,
                            "labelYOffset": -7,
                            "pointRadius": 20
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
                                // }
                                },
                                "style": {
                                    "height": 24,
                                    "width": 24,
                                    "icon": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png",
                                    "iconLarge": "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Chartreuse.png"
                                }
                            }
                        ]
                    },
                    "zoom":"true",
                    "readOnly":"false"
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