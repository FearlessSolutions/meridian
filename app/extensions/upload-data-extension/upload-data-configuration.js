define([

], function() {

    var configuration = {
        filetypes:{
            kml: {
                extension:'.kml'
            },
            csv: {
                extension: '.csv'
            },
            geojson: {
                extension: '.geojson'
            }
        },
        DATASOURCE_NAME: 'upload',
        DISPLAY_NAME: 'Upload',
        SERVER_NAME: 'upload',
        namespace: 'upload-extension',
        exports: [
            'geojson',
            'csv',
            'kml'
        ]
    };

    return configuration;

});