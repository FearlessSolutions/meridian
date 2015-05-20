require.config({
    baseUrl:'./', //This makes it so that all modes start at the same place.
    waitSeconds: 30,
    paths: {
        aura: 'bower_components/aura/lib',
        handlebars: 'bower_components/handlebars/handlebars',
        underscore: 'bower_components/underscore/underscore',
        jquery: 'bower_components/jquery/dist/jquery',
        bootstrap: 'libs/bootstrap-3.2.0/bootstrap',
        daterangepicker: 'libs/bootstrap-daterangepicker-master/daterangepicker',
        toastr: 'libs/toastr-2.0.1/toastr',
        jqueryDrag: 'libs/SlickGrid-master/lib/jquery.event.drag-2.2',
        jqueryDrop: 'libs/SlickGrid-master/lib/jquery.event.drop-2.2',
        bootstro: 'libs/bootstro/bootstro',
        typeahead: 'libs/bootstrap3-typeahead-3.0.3/bootstrap3-typeahead',
        backbone: 'libs/backbone-1.1.2/backbone',
        kml2geojson: 'libs/kml2geojson/kml2geojson',
        paginator: 'libs/bootstrap-paginator/bootstrap-paginator.min',
        jqueryCssWatch: 'libs/jquery-csswatch-1.2.1/jquery.csswatch',
        select2: 'libs/select2-3.4.8/select2',
        jqueryUI: 'libs/jquery-ui-1.11.2.custom/jquery-ui.min', // Custom build, check file's header to see what it includes
        slickLib: 'libs/SlickGrid-master', // Custom build, check file's header to see what it includes
        slickcore: 'libs/SlickGrid-master/slick.core',
        slickgrid: 'libs/SlickGrid-master/slick.grid',
        slickdataview: 'libs/SlickGrid-master/slick.dataview',
        slickRowSelectionModel: 'libs/SlickGrid-master/plugins/slick.rowselectionmodel',
        slickpager: 'libs/SlickGrid-master/controls/slick.pager',
        moment: 'libs/momentjs-2.8.3/moment.min',
        togeojson: 'libs/togeojson/togeojson',
        coordinateConverter: 'libs/coordinate-converter/cc',
        text: 'bower_components/requirejs-text/text'
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
        daterangepicker: {
            deps:[ 'jquery', 'bootstrap', 'moment']
        },
        typeahead: {
            deps: ['jquery'],
            exports: 'typeahead'
        },
        jqueryCssWatch: {
            deps: ['jquery']
        },
        paginator:{
            deps: ['jquery','bootstrap']
        },
        jqueryUI: {
            deps: ['jquery']
        },
        slickcore:{
            deps: ['jqueryUI']
        },
        slickgrid:{
            deps: ['slickcore', 'jqueryDrag', 'jqueryDrop']
        },
        slickdataview: {
            deps: ['slickgrid']
        },
        slickRowSelectionModel: {
            deps: ['slickgrid']
        },
        slickpager: {
            deps: ['slickgrid']
        },
        togeojson: {
            deps: ['jquery']
        }
    }
});

require(['jquery',
    'aura/aura',
    'meridian-config',
//    'text', //Load here for faster loading later
//    'bootstrap', //Load here for faster loading later
//    'handlebars', //Load here for faster loading later
    'jqueryCssWatch'
], function($, Aura, configuration) {
    // Listen to CSSWatch trigger (fired from datagrid/main.js)
    $(document).on('css-change', '#datagridContainer', function(event, change){
        $('#mapContainer').css('height', 'calc(100% - ' + change.height + ')');
        $('div[data-aura-component="rendering-engines/map-openlayers"], #map').css('height', '100%');
        window.dispatchEvent(new Event('resize')); // Trigger OpenLayers to redraw the map
    });

    Aura({
        debug: true,
        appName: configuration.appName,
        sources: {default: 'components'},
        mediator: configuration.mediator,
        version: configuration.version,
        releaseDate: configuration.releaseDate,
        cmapiVersion: configuration.cmapiVersion
    })
    .use('extensions/system-configuration-extension/system-configuration-extension')
    .use('extensions/utils-extension/utils-extension')
    .use('extensions/ajax-handler-extension/ajax-handler-extension')
    .use('extensions/session-extension/session-extension')
    .use('extensions/external-pubsub-extension/external-pubsub-extension')
    .use('extensions/state-manager-extension/state-manager-extension')
    .use('extensions/data-storage-client-extension/data-storage-client-extension')
    .use('extensions/splash-screen-extension/splash-screen-extension')
    .use('extensions/snapshot-extension/snapshot-extension')
    .use('extensions/map-configuration-extension/map-configuration-extension')
    .use('extensions/user-settings-extension/user-settings-extension')
    .use('extensions/support-configuration-extension/support-configuration-extension')
    .use('extensions/icon-extension/icon-extension')
    .use('extensions/locator-extension/locator-query-extension')
    .use('extensions/exports/export-utils/export-utils')
    .use('extensions/exports/geojson-extension/geojson-extension')
    .use('extensions/exports/csv-extension/csv-extension')
    .use('extensions/exports/kml-extension/kml-extension')
    .use('extensions/exports/googlemaps-extension/googlemaps-extension')
    .use('extensions/data-services/mock-extension/mock-extension')
    .use('extensions/data-services/fake-extension/fake-extension')
    .use('extensions/cmapi-extension/cmapi-extension')
    .use('extensions/upload-data-extension/upload-data-extension')

    .start({ components: 'body' })
    .then(function(){
        $('#left-side-menu').css('display','table').animate({
            left: "0px"
          }, 500);
        $('#loading').remove();
    });


    $('#left-side-menu .tab-handle').on('click', function() {
        $('#left-side-menu').toggleClass('docked');
    });

});


