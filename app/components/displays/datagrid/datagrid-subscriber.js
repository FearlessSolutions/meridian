define([
    './datagrid'
], function (datagrid) {
    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('map.datagrid.toggle', datagrid.toggleGrid);
            context.sandbox.on('data.clear.all', datagrid.clear);
            context.sandbox.on('map.layer.delete', datagrid.close);
        }
    };

    return exposed;
});