define([
    'toastr'
], function(toastr) {

    var context;

    var exposed = { 

        init: function(thisContext) {
            context = thisContext;
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-top-right",
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "2000",
                "timeOut": "4000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut",
                "target": "div[data-aura-component='displays/notifications']"
            };
        },
        displayMessage: function(params) {
            var messageType = params.messageType,
                messageTitle = params.messageTitle,
                messageText = params.messageText;
                
            if(messageType === 'success') {
                toastr.success(messageText, messageTitle);
            } else if(messageType === 'error') {
                toastr.error(messageText, messageTitle);
            } else if(messageType === 'warning'){
                toastr.warning(messageText, messageTitle);
            } else {
                toastr.info(messageText, messageTitle);
            }
        }

    };

    return exposed;

});
