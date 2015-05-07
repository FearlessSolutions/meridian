define([
    'text!./user-info.hbs',
    'handlebars'
], function (userInfoHBS) {
    var context;

    var exposed = {
        init: function(thisContext) {
            var context = thisContext;
            
            var userInfoTemplate = Handlebars.compile(userInfoHBS);

            var newAJAX = context.sandbox.utils.ajax({
                "type": "GET",
                "url": context.sandbox.utils.getCurrentNodeJSEndpoint() + '/echo',
                "xhrFields": {
                    "withCredentials": true
                }
            })
            .done(function(data) {
                var html = userInfoTemplate({
                    "fullName": data.fullName || null,
                    "userName": data.userName || null
                });
                context.html(html);
            })
            .error(function(e) {
                //If the error was because we aborted, ignore
                if(e.statusText === "abort") {
                    return;
                }
                context.html('ERROR');
                return false;
            });
        }
    };

    return exposed;

});