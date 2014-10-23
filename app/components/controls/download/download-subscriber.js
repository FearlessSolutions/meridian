define([
	'./download'
], function (component) {
	
	var context;

	var exposed = {
        init: function(thisContext) {
			context = thisContext;
        }
    };	

    return exposed;

});