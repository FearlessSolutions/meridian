define([
    'text!./csv-export.hbs'
], function(template) {
    return {
        description: 'Export to CSV File',
        label: 'CSV File',
        id: 'csv',
        template: template
    };
});