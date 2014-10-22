define([
], function(){

    var context;

    var exposed = {
        init: function(thisContext) {
            context = thisContext;
        },
        hidePubSubTester: function() {
            context.sandbox.emit('test.publisher.hide');
        }
    };

    return exposed;

});
