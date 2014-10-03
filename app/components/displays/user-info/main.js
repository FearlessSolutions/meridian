define([
    'text!./user-info.css',
    './user-info'
], function (userInfoCSS, userInfo) {

    return {
        initialize: function() {
            this.sandbox.utils.addCSS(userInfoCSS, 'displays-user-info-component-style');

            userInfo.init(this);
        }
    };
                
});