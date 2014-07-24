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
                    "name":"Sample GeoJSON Feature Collection",
                    "zoom":"true",
                    "readOnly":"false",
                    "autoUpdate": true
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