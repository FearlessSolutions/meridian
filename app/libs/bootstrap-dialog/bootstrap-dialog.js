+function ($) { "use strict";

    // DIALOG CLASS DEFINITION
    // ======================

    var Dialog = function (element) {
        this.$element  = $(element);
        this.isShown   = null;
    };

    Dialog.prototype.toggle = function (_relatedTarget) {

    };

    Dialog.prototype.show = function (_relatedTarget) {

    };

    Dialog.prototype.hide = function (e) {

    };

    Dialog.prototype.hideDialog = function () {
        var that = this;
        this.$element.hide();
    };

}(jQuery);
