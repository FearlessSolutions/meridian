define([

], function() {

    var config = {
        "data.add": {
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
            "payload": {}
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
        },
        "query.stop": {
            "payload": {
                "queryId": "test"
            }
        },
        "legend.update": {
            "payload": {
                "entries":[
                    {
                        "image": "http://www.cats.org.uk/uploads/images/pages/photo_latest14.jpg",
                        "description": "An adorable cat that might need a long description to do a test on and things like that."
                    },
                    {
                        "image": "http://thumbs.dreamstime.com/z/ugly-dog-13813608.jpg",
                        "description": "An ugly dog."
                    }
                ]
            }
        },
        "legend.show": {
            "payload": {}
        },
        "legend.hide": {
            "payload": {}
        }
    };

    return config;
});