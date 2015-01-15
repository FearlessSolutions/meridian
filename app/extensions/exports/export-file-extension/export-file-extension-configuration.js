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
                text: 'To CSV File',
                channel: 'export.file.csv'
            }//,
//            {
//                text: 'To KML File',
//                channel: 'export.file.kml'
//            },
//            {
//                text: 'To geoJSON File',
//                channel: 'export.file.geojson'
//            }
        ]

    };

    return configuration;

});