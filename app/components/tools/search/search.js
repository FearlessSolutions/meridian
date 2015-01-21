define([
    //'./query-publisher',
    'bootstrap'
], function (publisher) {
    var context,
        MENU_DESIGNATION = 'query-tool';

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            
        }
       
    }; 

    return exposed;
});