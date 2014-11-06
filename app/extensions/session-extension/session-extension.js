define([
    'jquery'
], function($){

    var context;
    /**
     * Exposes the id of the session to the {@link Sandbox} namespace.
     * @namespace Sandbox.sessionId
     * @memberof Sandbox
     */
    /**
     * @exports session-extension
     */
    var exposed = {
        /**
         * All Meridian extensions require an 'initialize' function to begin the loading process of the extension.
         * This extension sets the current session id and adds custom HTTP headers to the server request.
         * @function
         * @instance
         * @param  {Object} app Instance of the Meridian application.
         */
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
        /**
         * Applies the session id to {@link Sandbox.sessionId} 
         * @function
         * @instance
         * @param {String} sessionId - The id of the session.
         * @memberof module:session-extension
         */
        setSessionId: function(sessionId){
            var id = sessionId.split("-").join("");
            context.sandbox.sessionId = id;
        }
    };

    return exposed;
});



