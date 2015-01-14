define([
], function(){

    var config = {
    	//export should be channel name and the name of the function
        exports: {
            'export.download.geojson': 'GeoJSON',
            'export.google.maps': 'Google Maps'
        },
        keys: [
                    {
                        property: 'valid',
                        displayName: 'Valid',
                        weight: 75
                    }
        ],
        DATASOURCE_NAME: 'fake',
        DISPLAY_NAME: 'Fake',
        namespace: 'fake-extension'
    };

    return config;
})