require.config({
    paths: {
        'aura': '../javascripts/aura/lib',
        'handlebars': '../javascripts/handlebars-1.3.0/handlebars',
        'underscore': '../javascripts/underscore-1.6.0/underscore',
        'jquery': '../javascripts/jquery-1.11.1/jquery',
        'bootstrap': '../javascripts/bootstrap-3.2.0/bootstrap',
    },
    shim:{
        'aura': {
            deps: ['underscore', 'jquery'],
        },
        'bootstrap': {
            deps: ['jquery'],
        }
    }
});

require(['jquery', 'aura/aura'], function($, Aura) {

    Aura({
        "debug":true,
        sources: {default: './components'} 
    })
    .use('./extensions/utils-extension')
    .start({ components: 'body' });

});
