define([
    './csv-export',
    './csv-export-publisher',
    './csv-export-subscriber'
], function (component, publisher, subscriber) {
    return {
        initialize: function() {
            publisher.init(this);
            subscriber.init(this);
            component.init(this);
        }
    };                
});