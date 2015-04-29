define([
    './fake',
    './fake-publisher',
    './fake-subscriber'
], function (dataServiceFake, dataServiceFakePublisher, dataServiceFakeSubscriber) {

    return {
        initialize: function() {
            dataServiceFakePublisher.init(this);
            dataServiceFake.init(this);
            dataServiceFakeSubscriber.init(this);
        }
    };

});
