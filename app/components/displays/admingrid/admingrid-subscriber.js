define([
    './admingrid'
], function (admingrid) {
    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            //context.sandbox.on('search.admingrid.create', admingrid.destroy);
            context.sandbox.on('search.admingrid.create', admingrid.open);
            context.sandbox.on('search.admingrid.create', admingrid.resize);
        }
    };

    return exposed;
});