define([
    './mock',
    './mock-publisher',
    './mock-subscriber',
], function (dataServiceMock, dataServiceMockPublisher, dataServiceMockSubscriber) {

    return {
        initialize: function() {
            dataServiceMockPublisher.init(this);
            dataServiceMock.init(this);
            dataServiceMockSubscriber.init(this);
        }
    };

});
