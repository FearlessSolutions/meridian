define([
    './admingrid'
], function (admingrid) {
    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('search.admingrid.create', admingrid.visible);
            context.sandbox.on('search.admingrid.create', admingrid.createGridData);
            context.sandbox.on('search.admingrid.clear', admingrid.hidden);
        }
    };

    return exposed;
});