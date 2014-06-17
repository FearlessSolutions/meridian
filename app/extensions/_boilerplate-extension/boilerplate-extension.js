define([
], function() {

    // To enable '_boilerplate-extension', add following line to app.js
    // .use('extensions/_boilerplate-extension/boilerplate-extension')

    var app;

    var exposed = {
        initialize: function(thisApp) {
            
            app = thisApp;

            // Add to sandbox, so any component can use 'dummyMessage'
            app.sandbox.dummyMessage = "Hello World";
        }
    };

    return exposed;

});
