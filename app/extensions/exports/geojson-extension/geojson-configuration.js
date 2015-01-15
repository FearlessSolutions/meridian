define([
    'text!./geojson-export.hbs',
], function(template) {
    
    return {
        description: 'Export to geoJSON File',
        label: 'geoJSON File',
        channel: 'export.download.geojson',
        types: [
            'POINT',
            'LAYER',
            'ALL'
        ],
        id: 'geojson',
        template: template,
        templateFields: [
            'checkbox1',
            'checkbox2',
            'checkbox3',
            'checkbox4'
        ]
    };
});