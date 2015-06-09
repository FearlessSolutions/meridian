define([
    'bootstrap'
], function () {

    return {
        init: function(thisContext) {
            var context = thisContext;
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