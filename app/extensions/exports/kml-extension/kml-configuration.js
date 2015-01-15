 
 define([
], function() {
    
    return {
        description: 'Export to KML File',
        label: 'KML File',
        channel: 'export.download.kml',
        types: [
            'POINT',
            'LAYER',
            'ALL'
        ],
        id: 'kml'
    };
});