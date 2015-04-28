(function() {
  // This is ultimately fed to require.config().
  var Config = {
    baseUrl: '../../app',
    'paths': {
      'bootstrap': 'libs/bootstrap-3.2.0/bootstrap',
      'uploadComponent': 'components/tools/upload-data',
      'cmapi': 'components/apis/cmapi',
      'aura': 'bower_components/aura/lib',
      'handlebars': 'bower_components/handlebars/handlebars',
      'underscore': 'bower_components/underscore/underscore',
      'jquery': 'bower_components/jquery/dist/jquery',
      'bootstrap': 'libs/bootstrap-3.2.0/bootstrap',
      'daterangepicker': 'libs/bootstrap-daterangepicker-master/daterangepicker',
      'toastr': 'libs/toastr-2.0.1/toastr',
      'jqueryDrag': 'libs/SlickGrid-master/lib/jquery.event.drag-2.2',
      'jqueryDrop': 'libs/SlickGrid-master/lib/jquery.event.drop-2.2',
      'bootstro': 'libs/bootstro/bootstro',
      'typeahead': 'libs/bootstrap3-typeahead-3.0.3/bootstrap3-typeahead',
      'backbone': 'libs/backbone-1.1.2/backbone',
      'kml2geojson': 'libs/kml2geojson/kml2geojson',
      'paginator': 'libs/bootstrap-paginator/bootstrap-paginator.min',
      'jqueryCssWatch': 'libs/jquery-csswatch-1.2.1/jquery.csswatch',
      'select2': 'libs/select2-3.4.8/select2',
      'jqueryUI': 'libs/jquery-ui-1.11.2.custom/jquery-ui.min', // Custom build, check file's header to see what it includes
      'slickcore': 'libs/SlickGrid-master/slick.core',
      'slickgrid': 'libs/SlickGrid-master/slick.grid',
      'slickdataview': 'libs/SlickGrid-master/slick.dataview',
      'slickRowSelectionModel': 'libs/SlickGrid-master/plugins/slick.rowselectionmodel',
      'slickpager': 'libs/SlickGrid-master/controls/slick.pager',
      'moment': 'libs/momentjs-2.8.3/moment.min',
      'togeojson': 'libs/togeojson/togeojson',
      'coordinateConverter': 'libs/coordinate-converter/cc'
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
  };

    // If _TEST_MODE, configre to '../' since our tests are stored in './test/'.
  //if (typeof _TEST_MODE !== 'undefined' && _TEST_MODE === true) {
    require.config(Config);
    return true;
  //}

  // // If 'define' exists as a function, run main.
  // if (typeof define === 'function') {
  //   require.config(Config);
  //   require(['main'], function(Main) {
  //     Main.main();
  //   });
  //   return true;
  // }
  // // If exports exists as an object, CommonJS.
  // if (typeof module === 'object') {
  //   module.exports = Config;
  // }
  // // If module exists as an object, use CommonJS-like module exports for node.
  // if (typeof exports === 'object') {
  //   exports.RJSConfig = Config;
  // }

  //return Config;
})();