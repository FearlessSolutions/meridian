define([
], function() {	
	var cmapiConfiguration = {
		"subscribeChannels":{
      "map.overlay.create":{
        valid:true
      },
      "map.overlay.remove":{
        valid: true
      },
      "map.overlay.hide":{
        valid: true
      },
      "map.overlay.show":{
        valid: true
      },
      "map.feature.plot": {
          "valid": true
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
        "valid": true
      },
      "map.view.center.feature":{
        "valid": true
      },
      "map.view.center.location":{
        "valid": true
      },
      "map.view.center.bounds":{
        "valid": true
      },
      "map.view.clicked":{
        "valid": false
      },
      "map.status.request":{
        "valid": false
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
      "map.view.clicked":{
       "valid": false
      },*/
      "map.status.view":{
          "valid": false
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