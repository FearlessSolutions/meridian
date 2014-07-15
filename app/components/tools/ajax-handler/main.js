define([
    './ajax-handler-subscriber',
], function (ajaxHandlerSubscriber) {

    return {
        initialize: function() {
            ajaxHandlerSubscriber.init(this);
        }
    };

});
