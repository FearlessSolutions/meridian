require.config({
  baseUrl: './',
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


  define(function(require) {
  var chai = require('chai');
  var mocha = require('mocha');
  require('jquery');
  require('chai-jquery');

  // Chai
  var should = chai.should();
  chai.use(chaiJquery);

  mocha.setup('bdd');

  require([
    'model-tests2.js',
  ], function(require) {
    mocha.run();
  });



});

// require(['chai'], function(chai) {
//   console.log('im loaded on spec');
// });
