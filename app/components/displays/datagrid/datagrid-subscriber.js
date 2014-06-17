define([
    './datagrid'
], function (datagrid) {
    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.datagrid.toggle', datagrid.toggleGrid);
            context.sandbox.on('system.clear', datagrid.clear);
        }
    };

    return exposed;
});