define([
    './datagrid'
], function (datagrid) {
    var context;

    var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('datagrid.close', datagrid.close);
            context.sandbox.on('datagrid.open', datagrid.open);
            context.sandbox.on('datagrid.reload', datagrid.reload);
//            context.sandbox.on('map.layer.create', datagrid.reload);
            context.sandbox.on('map.layer.delete', datagrid.reload);
            context.sandbox.on('map.features.plot', datagrid.addData);
            context.sandbox.on('map.features.hide', datagrid.hideFeatures);
            context.sandbox.on('map.features.show', datagrid.showFeatures);
            context.sandbox.on('map.layer.hide', datagrid.hideLayer);
            context.sandbox.on('map.layer.show', datagrid.showLayer);
            context.sandbox.on('data.clear.all', datagrid.clear);
        }
    };

    return exposed;
});