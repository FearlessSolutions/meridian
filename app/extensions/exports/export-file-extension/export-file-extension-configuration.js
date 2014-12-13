define([

], function() {

    var configuration = {
//        urls: {
//            csv: 'csv url',
//            kml: 'kml url',
//            geojson: 'geojson url'
//        },
        exportOptions:[
            {
                text: 'CSV File',
                channel: 'export.file.csv'
            },
            {
                text: 'KML File',
                channel: 'export.file.kml'
            },
            {
                text: 'geoJSON File',
                channel: 'export.file.geojson'
            },
            {
                text: 'Google Maps',
                channel: 'export.file.googlemaps'
            }
        ]

    };

    return configuration;

});