define([
    './google-maps',
    './google-maps-subscriber'
], function (download, downloadSubscriber) {

    return {
        initialize: function() {
            download.init(this);
            downloadSubscriber.init(this);
        }
    };
                
});