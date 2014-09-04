define([
], function(){

    var context;

    /**
     * Datagrid publisher module.
     * @module datagrid-toggle-publisher
     */
    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        /**
         * Emits message to close the datagrid.
         * @event module:datagrid-toggle-publisher#closeDataGrid
         * @fires 'datagrid.close'
         */
        closeDatagrid: function() {
            context.sandbox.emit('datagrid.close');
        },
        /**
         * Emits message to open the datagrid.
         * @event module:datagrid-toggle-publisher#openDataGrid
         * @fires 'datagrid.open'
         */
        openDatagrid: function() {
            context.sandbox.emit('datagrid.open');
        },
        /**
         * Emits 
         * @event module:datagrid-toggle-publisher#publishMessage
         * @property {Object} params 
         * @property {String} params.messageType Type of message: {success|info|warning|error}
         * @property {String} params.messageTitle
         * @property {String} params.messageText 
         * @fires 'message.publish'
         */
        publishMessage: function(params) {
            context.sandbox.emit('message.publish', params);
        }
    };
    return exposed;

});