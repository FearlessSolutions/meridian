define([

], function() {

    var exportOps = {
        options:[
            {
                description: 'Export to CSV File',
                label: 'CSV File',
                channel: 'export.file.csv',
                state: 'active'
            },
            {
                description: 'Export to KML File',
                label: 'KML File',
                channel: 'export.file.kml',
                state: 'disabled'
            },
            {
                description: 'Export to geoJSON File',
                label: 'geoJSON File',
                channel: 'export.file.geojson',
                state: 'disabled'
            },
            {
                description: 'Export to Google Maps',
                label: 'Google Maps',
                channel: 'export.url.googlemaps',
                state: 'disabled'
            }
        ]
    };

    return exportOps;

});