define([
    './boilerplate-publisher'
], function (publisher) {

    var context;

	var exposed = {
        dummyPrefix: function(msg) {
            return 'Somethig before a dumb quote, "' + msg + '"';
        }
    };

    return exposed;

});