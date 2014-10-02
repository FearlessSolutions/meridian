define([
	'./internal-pubsub-tester-toggle'
], function (internalPubsubTesterToggle) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('test.publisher.show', internalPubsubTesterToggle.addActiveClass);
            context.sandbox.on('test.publisher.hide', internalPubsubTesterToggle.removeActiveClass);
            context.sandbox.on('data.clear.all', internalPubsubTesterToggle.removeActiveClass);
        }
    };	

    return exposed;
});