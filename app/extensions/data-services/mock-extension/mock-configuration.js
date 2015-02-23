define([
], function(){

    var config = {
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
        SERVER_NAME: 'mock',
        namespace: 'mock-extension',
        exports: [
            'geojson',
            'csv',
            'kml',
            'googlemaps'
        ]
    };

    return config;
});