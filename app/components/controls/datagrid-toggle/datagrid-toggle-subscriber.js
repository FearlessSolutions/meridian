define([
	'./datagrid-toggle'
], function (datagridToggle) {
    var context;


    
	var exposed = {
        init: function(thisContext){
            context = thisContext;
            /**
             * Description of channel here.
             * @typedef {Channel} datagrid.close
             * @memberof Channels
             */
            context.sandbox.on('datagrid.close', datagridToggle.removeActive);
            /**
             * @typedef {Channel} datagrid.open
             * @memberof Channels
             */
            context.sandbox.on('datagrid.open', datagridToggle.setActive);
            /**
             * 
             * @typedef {Channel} data.clear.all
             * @memberof Channels
             */
            context.sandbox.on('data.clear.all', datagridToggle.clear);
        }
    };	

    return exposed;
});