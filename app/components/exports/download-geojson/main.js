define([
    './download-geojson',
    './download-geojson-subscriber',
], function (download, downloadSubscriber) {

    return {
        initialize: function() {
            download.init(this);
            downloadSubscriber.init(this);
        }
    };
                
});