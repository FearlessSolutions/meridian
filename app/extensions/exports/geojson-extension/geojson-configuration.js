define([
    'text!./geojson-export.hbs'
], function(template) {
    return {
        description: 'Export to geoJSON File',
        label: 'geoJSON File',
        id: 'geojson',
        template: template
    };
});