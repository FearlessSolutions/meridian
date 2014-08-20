define([

], function() {

    var config = {
        "data.clear.all": {
            "payload": {}
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
        "datagrid.close": {
            "payload": {}
        },
        "datagrid.open": {
            "payload": {}
        },
        "datagrid.reload": {
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
        "map.draw.bbox.added": {
            "payload": {}
        },
        "map.draw.bbox.remove": {
            "payload": {}
        },
        "map.draw.bbox.start": {
            "payload": {}
        },
        "map.features.plot": {
            "payload": {
              "layerId": "TestLayer1",
              "data": [
                {
                  "classification": "U",
                  "layerId": "TestLayer1",
                  "featureId": "f74ff07f-4964-4f7e-beb6-33e6d2abb6ef",
                  "dataService": "mock",
                  "id": "f74ff07f-4964-4f7e-beb6-33e6d2abb6ef",
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                      [-9.0, 10.0], [-9.0, 0.0], [0.0, 0.0], [0.0, 10.0]
                      ]]
                  },
                  "type": "Feature"
                },
                {
                  "classification": "U",
                  "layerId": "TestLayer1",
                  "featureId": "f74ff07f-4964-4f7e-beb6-33e6d2abb6ef",
                  "dataService": "mock",
                  "id": "f74ff07f-4964-4f7e-beb6-33e6d2abeee",
                  "geometry": {
                    "type": "LineString",
                    "coordinates": [ [-12.0, 0.0], [-8.0, 10.0] ]
                      },
                  "type": "Feature"
                },
                {
                  "classification": "U",
                  "layerId": "TestLayer1",
                  "featureId": "07f6b9fd-28f1-4de8-b112-fbe0b3df1cd5",
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
                  "layerId": "TestLayer1",
                  "featureId": "d3bc9d37-e683-4195-9475-bd4f37887d21",
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
                },
                {
                  "classification": "U",
                  "layerId": "TestLayer1",
                  "featureId": "d3bc9d37-e683-4195-9475-bd4f37887123",
                  "dataService": "mock",
                  "id": "d3bc9d37-e683-4195-9475-bd4f37887123",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [
                      -9,
                      9
                    ]
                  },
                  "type": "Feature"
                }
              ]
            }
        },
        "map.features.hide": {
            "payload": {
              "layerId": "TestLayer1",
              "featureIds": [
                "f74ff07f-4964-4f7e-beb6-33e6d2abb6ef",
                "d3bc9d37-e683-4195-9475-bd4f37887d21"
              ]
            }
        },
        "map.features.show": {
            "payload": {
              "layerId": "TestLayer1",
              "featureIds": [
                "f74ff07f-4964-4f7e-beb6-33e6d2abb6ef",
                "d3bc9d37-e683-4195-9475-bd4f37887d21"
              ]
            }
        },
        "map.features.update": {
            "payload": {
              "layerId": "TestLayer1",
              "featureObjects": [
                {
                  "featureId": "d3bc9d37-e683-4195-9475-bd4f37887d21",
                  "style": {
                    "icon": "http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Marker-Outside-Pink-icon.png",
                    "width": 24,
                    "height": 24
                  }
                }
              ]
            }
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
                "layerId": "TestLayer1",
                "name": "Test Layer",
                "coords": {
                    "minLat": "7.602108",
                    "minLon": "-13.908691",
                    "maxLat": "11.587669",
                    "maxLon": "-8.283691"
                }
            }
        },
        "map.layer.delete": {
          "payload": {}
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
        "map.legend.update": {
          "payload": {
            "image": "http://www.trailsrus.com/breathittcounty/images/trails-legend.jpg"
          }
        },
        "map.legend.show": {
            "payload": {}
        },
        "map.legend.hide": {
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
        "map.zoom.out": {
            "payload": {}
        },
        "map.zoom.toLayer": {
            "payload": {
                "layerId": "TestLayer1"
            }
        },
        "map.zoom.toFeatures": {
            "payload": {
                "layerId": "TestLayer1",
                "featureIds": [
                  "f74ff07f-4964-4f7e-beb6-33e6d2abb6ef",
                  "d3bc9d37-e683-4195-9475-bd4f37887d21"
                ]
            }
        },
        "map.zoom.toLocation": {
            "payload": {
                "minLon": -20,
                "minLat": 20,
                "maxLon": 20,
                "maxLat": 40
            }
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
        "progress.queue.add": {
            "payload": {}
        },
        "progress.queue.remove": {
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
        },
        "query.stop": {
            "payload": {
                "layerId": "test"
            }
        }
    };

    return config;
});