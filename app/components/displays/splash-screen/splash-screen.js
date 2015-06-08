define([
    'bootstrap'
], function () {

    return {
        init: function(thisContext) {
            context = thisContext;
            context.$('#splashScreen')
                .modal({
                    backdrop: 'static',
                    keyboard: false
                })
                .on('hidden.bs.modal', function () {
                    context.sandbox.utils.preferences.set('splashScreenHidden', true);
                });  
        }
    };


});