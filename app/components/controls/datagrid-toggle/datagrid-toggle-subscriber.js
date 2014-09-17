define([
	'./datagrid-toggle'
], function (datagridToggle) {
    var context;


    
	var exposed = {
        init: function(thisContext){
            context = thisContext;
            /**
             * @typedef datagrid.close
             * @memberof Channels
             */
            context.sandbox.on('datagrid.close', datagridToggle.removeActive);
            /**
             * @typedef datagrid.open
             * @memberof Channels
             */
            context.sandbox.on('datagrid.open', datagridToggle.setActive);
            /**
             * @typedef data.clear.all
             * @memberof Channels
             */
            context.sandbox.on('data.clear.all', datagridToggle.clear);
        }
    };	

    return exposed;
});