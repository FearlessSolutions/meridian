define([
	'./search'
], function (searchTool) {
    var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
            
        }
    };	

    return exposed;
});