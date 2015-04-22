define([
    './data-history'
], function (dataHistory) {
    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.sandbox.on('data.history.close', dataHistory.close);
            context.sandbox.on('data.history.open', dataHistory.open);
            context.sandbox.on('data.clear.all', dataHistory.clear);
        },
        closeDataHistory: function() {
            context.sandbox.emit('data.history.close');
        },
        openDataHistory: function() {
            context.sandbox.emit('data.history.open');
        },
        publishOpening: function(params) {
            context.sandbox.emit('menu.opening', params);
        },
        restoreDataset: function(params) {
            context.sandbox.emit('data.restore', params);
        },
        deleteDataset: function(params) {
            context.sandbox.emit('map.layer.delete', params);
        },
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params); 
        },
        requeryDataset: function(params) {
            context.sandbox.emit('data.requery', params); 
        }
    };	

    return exposed;
});