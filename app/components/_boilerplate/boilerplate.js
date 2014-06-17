define([
    './boilerplate-publisher',
    './boilerplate-extended'
], function (publisher, boilerplatExtended) {

    // To add '_boilerplate' component, add following line to index.html
    // <div data-aura-component="_boilerplate"></div>

    var context;

    var exposed = {
        init: function(thisContext) {
            // The 'context' provides a reference to 'sandbox' using 'context.sandbox'
            context = thisContext;
        },
        dummyFunction: function(args) {
            // Example of an extension being used
            var msg = context.sandbox.dummyMessage;

            // The 'logger' is a part of the core
            context.sandbox.logger.log(boilerplatExtended.dummyPrefix(msg) + exposed.dummySuffix());
        }, 
        dummySuffix: function() {
            publisher.publishMessage({
                "messageType": "info",
                "messageTitle": "Boilerplate",
                "messageText": "What did Ben say?"
            });
            return ' - Ben Franklin';
        }
    };

    return exposed;

});