define([
    './fake',
    './fake-mediator',
], function (
    dataServiceFake,  
    dataServiceFakeMediator
) {
    
    return {
        initialize: function() {
            dataServiceFakeMediator.init(this);
            dataServiceFake.init(this, dataServiceFakeMediator);
        }
    };

});
