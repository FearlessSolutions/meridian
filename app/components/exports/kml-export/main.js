define([
    './kml-export',
    './kml-export-publisher',
    './kml-export-subscriber',
    'handlebars'
], function (component, publisher, subscriber) {
    return {
        initialize: function() {
            publisher.init(this);
            subscriber.init(this);
            component.init(this);
        }
    };                
});