define([
], function() {
    
    return {
        description: 'Export to geoJSON File',
        label: 'geoJSON File',
        channel: 'export.download.geojson',
        types: [
            'POINT',
            'LAYER',
            'ALL'
        ],
        id: 'geojson'
    };
});