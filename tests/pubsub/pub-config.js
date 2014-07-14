define([
], function() { 
    var pubConfiguration = {
        "channels":{
            "map.overlay.create":{
                valid:true,
                sample: {
                    "name": "Test Name 1",
                    "overlayId": "testOverlayId1"
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
                    "readOnly":"false"
                }
            },
            "map.view.zoom":{
                "valid": true
            },
            "map.view.center.overlay":{
                "valid": false
            },
            "map.view.center.feature":{
                "valid": false
            },
            "map.view.center.location":{
                "valid": true,
                "sample": {
                    "location": {
                        "lat": 30,
                        "lon": 30

                    },
                    "zoom": 3000000
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

                    },
                    "zoom": 3000000
                }
            }
        }
    };

    return pubConfiguration;
});