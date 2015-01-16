define([
    './googlemaps-export',
    './googlemaps-export-publisher',
    './googlemaps-export-subscriber',
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