define([
    './splash-screen-publisher',
    'bootstrap'
], function (publisher) {

    var context;
	
    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.$('#splashScreen').modal({backdrop: 'static', keyboard: false});
        }
    };

    return exposed;

});