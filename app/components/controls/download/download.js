define([
    'bootstrap'
], function(){

    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;

            context.$('#downloadButton').on('click', function(event){
                event.preventDefault();
                window.location = context.sandbox.utils.getCurrentNodeJSEndpoint() + '/results.csv?x-meridian-session-id=' + context.sandbox.sessionId;
            });
        }
    };

    return exposed;

});