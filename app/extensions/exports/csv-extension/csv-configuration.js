define([
], function() {

    return {
        description: 'Export to CSV File',
        label: 'CSV File',
        channel: 'export.download.csv',
        types: [
            'POINT',
            'LAYER',
            'ALL'
        ],
        id: 'csv'
    };
});