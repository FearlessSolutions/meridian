define([
], function() {	
	var cmapiConfiguration = {
		"subscribeChannels":{
      "map.overlay.create":{
        valid:true
      },
      "map.overlay.remove":{
        valid: false
      },
      "map.overlay.hide":{
        valid: true
      },
      "map.overlay.show":{
        valid: true
      },
      "map.feature.plot":{
        "valid": true,
        "sample": {
           "overlayId":"2d882141-0d9e-59d4-20bb-58e6d0460699.1",
           "featureId":"example.geojson.1",
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
                       "style":{
                          "fillColor":"red"
                       }
                    }
                 }
              ]
           },
           "name":"Sample GeoJSON Feature Collection",
           "zoom":"true",
           "readOnly":"false"
        }
      },
      /*"map.feature.plot.url":{
       "valid": false
      },
      "map.feature.unplot":{
       "valid": false
      },
      "map.feature.hide":{
       "valid": false
      },
      "map.feature.show":{
       "valid": false
      },
      "map.feature.selected":{
       "valid": false
      },
      "map.feature.deselected":{
       "valid": false
      },
      "map.feature.update":{
       "valid": false
      },*/
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
        "valid": true
      },
      "map.view.center.bounds":{
        "valid": false
      },
      "map.view.clicked":{
        "valid": false
      },
      "map.status.request":{
        "valid": true
      }
    },
    "publishChannels":{
      /*"map.overlay.create":{
       "valid":false
      },
      "map.overlay.remove":{
       "valid": false
      },
      "map.overlay.hide":{
       "valid": false
      },
      "map.overlay.show":{
       "valid": false
      },
      "map.feature.plot":{
       "valid": false
      },
      "map.feature.plot.url":{
       "valid": false
      },
      "map.feature.unplot":{
       "valid": false
      },
      "map.feature.hide":{
       "valid": false
      },
      "map.feature.show":{
       "valid": false
      },
      "map.feature.selected":{
       "valid": false
      },
      "map.feature.deselected":{
       "valid": false
      },
      "map.feature.update":{
       "valid": false
      },
      "map.view.zoom":{
       "valid": false
      },
      "map.view.center.overlay":{
       "valid": false
      },
      "map.view.center.feature":{
       "valid": false
      },
      "map.view.center.location":{
       "valid": false
      },
      "map.view.center.bounds":{
       "valid": false
      },
      "map.view.clicked":{
       "valid": false
      },*/
      "map.status.view":{
          "valid": true
      },
      "map.status.format":{
          "valid": true
      },
      "map.status.about":{
          "valid": true
      },
      "map.status.selected":{
          "valid": true
      },
      "error":{
      "valid": true
      }
    }
	};

	return cmapiConfiguration;
});