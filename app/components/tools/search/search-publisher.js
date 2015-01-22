define([
], function () {
	var context;

	var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        publisherSearchAdmingridCreate: function(params){
            // channel name should be changed later
            context.sandbox.emit('search.admingrid.create', params);
        }
    };

    return exposed;
});