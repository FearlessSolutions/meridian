define([
    'bootstrap'
], function () {

    var context;
	
    var exposed = {
        init: function(thisContext) {
            context = thisContext;
            context.$('#splashScreen')
                .modal({backdrop: 'static', keyboard: false})
                .on('hidden.bs.modal', function () {
                    context.sandbox.utils.preferences.set('splashScreenHidden', true);
                });  
        }
    };

    return exposed;

});