define([
    './export-file',
    './export-file-publisher',
    './export-file-subscriber'
], function (component, publisher, subscriber) {

    return {
        initialize: function() {
            publisher.init(this);
            component.init(this);
            subscriber.init(this);
        }
    };

});
