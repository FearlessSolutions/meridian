define([
    'jquery'
], function($){

    var context;

    var exposed = {
        initialize: function(app) {

            context = app;

            exposed.setSessionId(context.sandbox.utils.UUID());

            $.ajaxSetup({
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function(jqXHR, httpInfo){
                    var currentHost = context.sandbox.utils.getCurrentNodeJSEndpoint();
                    if (httpInfo.url.substring(0, currentHost.length) === currentHost){
                        jqXHR.setRequestHeader('x-meridian-session-id', context.sandbox.sessionId);
                    }
                }
            });
        },
        setSessionId: function(sessionId){
            var id = sessionId.split("-").join("");
            context.sandbox.sessionId = id;
        }
    };

    return exposed;
});



