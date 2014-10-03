define([
    './user-info'
], function (userInfo) {

    return {
        initialize: function() {
            userInfo.init(this);
        }
    };
                
});