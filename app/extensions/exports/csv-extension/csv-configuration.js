define([
    'text!./csv-export.hbs',
], function(template) {

    return {
        description: 'Export to CSV File',
        label: 'CSV File',
        channel: 'export.download.csv',
        types: [
            'POINT',
            'LAYER',
            'ALL'
        ],
        id: 'csv',
        template: template,
        templateFields: [
            'csv-export-text'
        ]
    };
});