define([
    './geojson-export',
    './geojson-export-publisher',
    './geojson-export-subscriber'
], function (component, publisher, subscriber) {
    return {
        initialize: function() {
            publisher.init(this);
            subscriber.init(this);
            component.init(this);
        }
    };                
});