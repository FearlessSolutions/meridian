 
 define([
     'text!./kml-export.hbs'
 ], function(template) {
    return {
        description: 'Export to KML File',
        label: 'KML File',
        id: 'kml',
        template: template
    };
});