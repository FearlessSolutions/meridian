define([
    './ajax-handler',
    './ajax-handler-publisher',
    './ajax-handler-subscriber'
], function (ajaxHandler, ajaxHandlerPublisher, ajaxHandlerSubscriber) {

    return {
        initialize: function() {
            ajaxHandler.init(this);
            ajaxHandlerPublisher.init(this);
            ajaxHandlerSubscriber.init(this);
        }
    };

});
