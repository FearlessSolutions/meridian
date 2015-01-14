define([
], function(){

    var config = {
	        exports: {
	            'export.download.geojson': 'GeoJSON',
	            'export.google.maps': 'Google Maps',
	            'export.download.csv': 'CSV'
	        },
	        keys: [
		            {
		            	property: 'percent',
		                displayName: '%',
		                weight: 76
		            },
		            {
		                property: 'color',
		                displayName: 'Color',
		                weight: 69
		            }
	        ],
	        DATASOURCE_NAME: 'mock',
	        DISPLAY_NAME: 'Mock',
	        namespace: 'mock-extension'
    };

    return config;
})