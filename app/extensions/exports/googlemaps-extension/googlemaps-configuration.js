define([
    'text!./googlemaps-export.hbs'
], function(template) {
    
    return {
        description: 'Export to Google Maps',
        label: 'Google Maps',
        id: 'googlemaps',
        template: template
    };
});