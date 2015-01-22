define([
    './admingrid'
], function (admingrid) {
    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('search.admingrid.destroy', admingrid.close);
            context.sandbox.on('search.admingrid.create', admingrid.open);
        }
    };

    return exposed;
});