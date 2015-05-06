define([
    './mock',
    './mock-mediator'
], function (
    dataServiceMock, 
    dataServiceMockMediator
) {

    return {
        initialize: function() {
            dataServiceMockMediator.init(this);
            dataServiceMock.init(this, dataServiceMockMediator);
        }
    };

});
