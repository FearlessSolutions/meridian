define([
	'./download'
], function (component) {
	
	var context;

	var exposed = {
        init: function(thisContext){
			context = thisContext;
            context.sandbox.on('data.clear.all', component.clear);
        }
    };	

    return exposed;

});