define([

], function() {

    var config = {
        "data.add": {
            "payload": {
              "queryId": "TestLayer1",
              "data": [
                {
                  "classification": "U",
                  "queryId": "TestLayer1",
                  "featureId": "f74ff07f-4964-4f7e-beb6-33e6d2abb6ef",
                  "lat": 8.82868,
                  "lon": -13.430793,
                  "color": "red",
                  "dataService": "mock",
                  "id": "f74ff07f-4964-4f7e-beb6-33e6d2abb6ef",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [
                      -10,
                      10
                    ]
                  },
                  "type": "Feature"
                },
                {
                  "classification": "U",
                  "queryId": "TestLayer1",
                  "featureId": "07f6b9fd-28f1-4de8-b112-fbe0b3df1cd5",
                  "lat": 8.686703,
                  "lon": -13.008265,
                  "color": "yellow",
                  "dataService": "mock",
                  "id": "07f6b9fd-28f1-4de8-b112-fbe0b3df1cd5",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [
                      -10,
                      8
                    ]
                  },
                  "type": "Feature"
                },
                {
                  "classification": "U",
                  "queryId": "TestLayer1",
                  "featureId": "d3bc9d37-e683-4195-9475-bd4f37887d21",
                  "lat": 8.800177,
                  "lon": -13.089125,
                  "color": "blue",
                  "dataService": "mock",
                  "id": "d3bc9d37-e683-4195-9475-bd4f37887d21",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [
                      -10,
                      9
                    ]
                  },
                  "type": "Feature"
                }
              ]
            }
        },
        "data.error": {
            "payload": {}
        },
        "data.finished": {
            "payload": {}
        },
        "data.record.identify": {
            "payload": {}
        },
        "event.count.add": {
            "payload": {}
        },
        "map.basemap.change": {
            "payload": {}
        },
        "map.center.set": {
            "payload": {}
        },
        "map.cluster": {
            "payload": {}
        },
        "map.datagrid.toggle": {
            "payload": {}
        },
        "map.draw.bbox.added": {
            "payload": {}
        },
        "map.draw.bbox.remove": {
            "payload": {}
        },
        "map.draw.bbox.start": {
            "payload": {}
        },
        "map.get.extent": {
            "payload": {}
        },
        "map.heat.configLayers": {
            "payload": {}
        },
        "map.heat.on": {
            "payload": {}
        },
        "map.heat.off": {
            "payload": {}
        },
        "map.label.create": {
            "payload": {}
        },
        "map.layer.create": {
            "payload": {
                "queryId": "TestLayer1",
                "name": "Test Layer",
                "coords": {
                    "minLat": "7.602108",
                    "minLon": "-13.908691",
                    "maxLat": "11.587669",
                    "maxLon": "-8.283691"
                }
            }
        },
        "map.layer.hide": {
            "payload": {}
        },
        "map.layer.hide.all": {
            "payload": {}
        },
        "map.layer.show": {
            "payload": {}
        },
        "map.layer.toggle": {
            "payload": {}
        },
        "map.uncluster": {
            "payload": {}
        },
        "map.view.extent": {
            "payload": {}
        },
        "map.visualMode": {
            "payload": {"mode": "cluster"}
        },
        "map.zoom.in": {
            "payload": {}
        },
        "map.zoom.location": {
            "payload": {}
        },
        "map.zoom.out": {
            "payload": {}
        },
        "menu.opening": {
            "payload": {}
        },
        "message.publish": {
            "payload": {
                "messageType": "warn",
                "messageTitle": "Internal PubSub Tester",
                "messageText": "This is a sample message."
            }
        },
        "point.plot": {
            "payload": {
              "type": "feature",
              "geometry": {
                "type": "point",
                "coordinates": [
                  0,
                  0
                ]
              },
              "properties": {}
            }
        },
        "system.clear": {
            "payload": {}
        },
        "timeline.playback.start": {
            "payload": {}
        },
        "timeline.playback.stop": {
            "payload": {}
        },
        "query.execute": {
            "payload": {}
        }
    };

    return config;
});