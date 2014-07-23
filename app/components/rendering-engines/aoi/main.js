define([
    './aoi',
    './aoi-publisher',
    './aoi-subscriber'
], function (aoi, aoiPublisher, aoiSubscriber) {
    return {
        initialize: function() {
            aoiPublisher.init(this);
            aoiSubscriber.init(this);
            aoi.init(this);
        }
    };                
});