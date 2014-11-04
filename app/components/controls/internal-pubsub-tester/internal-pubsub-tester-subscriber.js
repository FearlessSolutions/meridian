define([
	'./internal-pubsub-tester'
], function (internalPubsubTester) {
    var context;

	var exposed = {
        init: function(thisContext){
            context = thisContext;
            context.sandbox.on('test.publisher.show', internalPubsubTester.show);
            context.sandbox.on('test.publisher.hide', internalPubsubTester.hide);
            context.sandbox.on('data.clear.all', internalPubsubTester.hide);
        }
    };	

    return exposed;
});