require.config({
    paths: {
        aura: 'bower_components/aura/lib',
        handlebars: 'bower_components/handlebars/handlebars',
        underscore: 'bower_components/underscore/underscore',
        jquery: 'bower_components/jquery/dist/jquery',
        bootstrap: 'libs/bootstrap-3.0.3/bootstrap',
        toastr: 'libs/toastr-2.0.1/toastr',
        bootstrapDialog: 'libs/bootstrap-dialog/bootstrap-dialog',
        jqueryDrag: 'libs/jquery-drag-0.1.0/jquery-drag',
        bootstro: 'libs/bootstro/bootstro',
        typeahead: 'libs/bootstrap3-typeahead-3.0.3/bootstrap3-typeahead',
        backbone: 'libs/backbone-1.1.2/backbone',
        boostrapMultiselect: 'libs/bootstrap-multiselect-0.9.4/bootstrap-multiselect',
        kml2geojson: 'libs/kml2geojson/kml2geojson',
        paginator: 'libs/bootstrap-paginator/bootstrap-paginator.min',
        datatable: 'libs/dynamic-bootstrap-table/dynamic-bootstrap-table',
        jqueryCssWatch: 'libs/jquery-csswatch-1.2.1/jquery.csswatch',
        select2: 'libs/select2-3.4.8/select2',
        jqueryUI: 'libs/jquery-ui-1.10.4/jquery-ui-1.10.4.custom.min' // Custom build, check file's header to see what it includes

    },
    shim:{
        aura: {
            deps: ['underscore', 'jquery']
        },
        backbone: {
            deps: ['underscore', 'jquery']
        },
        bootstro: {
            deps: ['jquery','bootstrap'],
            exports: 'bootstro'
        },
        typeahead: {
            deps: ['jquery'],
            exports: 'typeahead'
        },
        jqueryCssWatch: {
            deps: ['jquery']
        },
        boostrapMultiselect: {
            deps: ['jquery','bootstrap']
        },
        paginator:{
            deps: ['jquery','bootstrap']
        },
        datatable:{
            deps: ['jquery','bootstrap', 'paginator']
        },
        jqueryUI: {
            deps: ['jquery']
        }
    }
});

require(['jquery', 'aura/aura'], function($, Aura) {

    
    Aura({
        "debug":true,
        sources: {default: 'components'} 
    })
    .use('extensions/utils-extension/utils-extension')
    .start({ components: 'body' });

});
