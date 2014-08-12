define([
], function () {

	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        closeDatagrid: function(params) {
            context.sandbox.emit('datagrid.close', params);
        },
        identifyRecord: function(params) {
            context.sandbox.emit('map.feature.identify', params);
        }
    };

    return exposed;

});