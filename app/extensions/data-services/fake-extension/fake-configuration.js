define([
], function(){

    var config = {
        keys: [
            {
                property: 'valid',
                displayName: 'Valid',
                weight: 75
            }
        ],
        DATASOURCE_NAME: 'fake',
        DISPLAY_NAME: 'Fake',
        namespace: 'fake-extension',
        exports: [
            'geojson',
            'csv',
            'kml'
        ]
    };

    return config;
});