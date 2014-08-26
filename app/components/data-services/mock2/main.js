define([
    './mock2',
    './mock2-publisher',
    './mock2-subscriber',
], function (dataServiceMock2, dataServiceMock2Publisher, dataServiceMock2Subscriber) {

    return {
        initialize: function() {
            dataServiceMock2Publisher.init(this);
            dataServiceMock2.init(this);
            dataServiceMock2Subscriber.init(this);
        }
    };

});
