define([
], function(){

    var context;

    
    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        /**
         * Function in charge emiting the event called datagrid.close for the datagrid-toggle module. 
         * @instance
         * @memberof module:datagrid-toggle
         */
        closeDatagrid: function() {
            /**
            * Emits message to close the datagrid.
            * @event module:datagrid-toggle#datagrid-close
            * @memberof module:datagrid-toggle
            */
            context.sandbox.emit('datagrid.close');
        },
        /**
         * Function in charge of emiting the event called datagrid.open for the datagrid-toggle module. 
         * @instance
         * @memberof module:datagrid-toggle
         */
        openDatagrid: function() {
            /**
            * Emits message to open the datagrid.
            * @event module:datagrid-toggle#datagrid-open
            * @memberof module:datagrid-toggle
            */
            context.sandbox.emit('datagrid.open');
        },
       
       /**
        * Funciton in charge of emmiting the event called message.publish for the datagrid-toggle module. 
        * @instance
        * @param {Object} params 
        * @param {String} params.messageType Type of message: {success|info|warning|error}
        * @param {String} params.messageTitle
        * @param {String} params.messageText 
        * @memberof module:datagrid-toggle
        */
        publishMessage: function(params) {
            /**
            * Emits a message to be published.
            * @event module:datagrid-toggle#message-publish
            * @memberof module:datagrid-toggle
            */
            context.sandbox.emit('message.publish', params);
        }
    };
    return exposed;

});