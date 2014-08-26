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

require(['jquery', 'aura/aura', 'jqueryCssWatch'], function($, Aura) {

    // Listen to CSSWatch trigger (fired from datagrid/main.js)
    $(document).on('css-change', '#datagridContainer', function(event, change){
        console.log('CSS Change:', change.width, 'height:', change.height);
        $('#mapContainer').css('height', 'calc(100% - 32px - ' + change.height + ')');
        $('div[data-aura-component="rendering-engines/map-openlayers"], #map').css('height', '100%');
        window.dispatchEvent(new Event('resize')); // Trigger OpenLayers to redraw the map
    });
    
    Aura({
        "debug": true,
        "appName": "Meridian",
        "sources": {"default": "components"} 
    })
    .use('extensions/system-configuration-extension/system-configuration-extension')
    .use('extensions/utils-extension/utils-extension')
    .use('extensions/ajax-handler-extension/ajax-handler-extension')
    .use('extensions/session-extension/session-extension')
    .use('extensions/external-pubsub-extension/external-pubsub-extension')
    .use('extensions/state-manager-extension/state-manager-extension')
    .use('extensions/data-storage-extension/data-storage-extension')
    .use('extensions/splash-screen-extension/splash-screen-extension')
    .use('extensions/snapshot-extension/snapshot-extension')
    .use('extensions/map-configuration-extension/map-configuration-extension')
    .use('extensions/user-settings-extension/user-settings-extension')
    .use('extensions/support-configuration-extension/support-configuration-extension')
    .use('extensions/icon-extension/icon-extension')
    .use('extensions/locator-extension/locator-query-extension')
    .use('extensions/locator-extension/locator-formatData-extension')
    .use('extensions/mock-extension/mock-extension')
    .use('extensions/mock-extension/mock2-extension')
    .use('extensions/cmapi-extension/cmapi-extension')
//    .use('extensions/csv-upload-extension/csv-upload-extension')
    .start({ "components": "body" });

});
