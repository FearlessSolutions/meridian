require.config({
  baseUrl: '.',
  paths: {
    'jquery'        : '../../app/bower_components/jquery/dist/jquery',
    'underscore'    : '../../app/bower_components/underscore/underscore',
    'backbone'      : '../../app/libs/backbone-1.1.2/backbone',
    'mocha'         : 'libs/mocha',
    'chai'          : 'libs/chai',
    'chai-jquery'   : 'libs/chai-jquery',
    'models'        : './models'
  },
  shim: {
    'chai-jquery': ['jquery', 'chai']
  }
});

// require(['chai'], function(chai) {
//   console.log('im loaded on spec');
// });